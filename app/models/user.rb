# frozen_string_literal: true

class User < ApplicationRecord
  has_many :photos
  has_many :signatures, -> { active }

  acts_as_paranoid
  devise :database_authenticatable, :registerable, :confirmable, :recoverable, :rememberable, :trackable, :validatable
  devise :omniauthable, omniauth_providers: %i(facebook instagram)

  enum role: %i(normal admin)

  before_validation :generate_username, if: -> { username.blank? && (first_name.present? || last_name.present?) }
  validates :username, presence: true, uniqueness: true

  validates_numericality_of :born, allow_nil: true, greater_than: 1900, less_than: 2017, only_integer: true
  validates_presence_of :first_name

  def self.from_omniauth(auth)
    user = where('oauth @> ?', JSON.dump(auth.provider => { uid: auth.uid })).take
    if user
      user.oauth = auth
      user.save if user.changed?
      user
    else
      user = new password: Devise.friendly_token[0, 20]
      user.oauth = auth
      user.skip_confirmation!
      user.password_confirmation = nil
      user.tap(&:save)
    end
  end

  def generate_username
    base = [first_name, last_name].reject(&:blank?).join(' ').presence
    base ||= email.to_s.split('@').first.presence
    base ||= SecureRandom.uuid
    6.times.detect do |x|
      username = [base, (x.positive? ? x : nil)].reject(&:blank?).join('-').parameterize
      self.username = username unless self.class.where(username: username).exists?
    end
  end

  def full_name
    [first_name, last_name].reject(&:blank?).join(' ')
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def oauth=(auth)
    logger.debug auth
    oauth[auth.provider] = { uid: auth.uid }
    case auth.provider
    when 'facebook'
      self.email = auth.info.email if email.blank?
      self.first_name = auth.info.first_name if first_name.blank?
      self.last_name = auth.info.last_name if last_name.blank?
    when 'instagram'
      oauth['instagram']['username'] = auth.info.nickname
      oauth['instagram']['token'] = auth.credentials.token
      self.email = SecureRandom.uuid + '@empty' if email.blank?
      if first_name.blank? && last_name.blank?
        name_chunks = auth.info.name.split(/\s+/, 2)
        self.first_name = name_chunks.first
        self.last_name = name_chunks.last
      end
      self.username = auth.info.nickname if username.blank?
    end
  end

  def published?
    published_at.present?
  end

  def publish!
    touch :published_at
  end

  def subscribed=(val)
    self.subscribed_at = val ? Time.current : nil
  end

  def subscribed?
    subscribed_at.present?
  end

  alias subscribed subscribed?

  def to_param
    username.presence || super
  end

  def unpublish!
    update_columns(published_at: nil)
  end
end
