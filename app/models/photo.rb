# frozen_string_literal: true

class Photo < ApplicationRecord
  SIZES = {
    cm: %w(20x30 30x40 40x60 60x90 75x115 100x150),
    in: %w(8x12 12x16 16x24 24x36 30x45 40x60)
  }.freeze

  acts_as_paranoid

  belongs_to :user

  scope :uploaded, -> { where.not(status: 0) }
  scope :available, -> { uploaded.where.not(status: statuses[:rejected]) }

  enum paper: %i(fineart rcphoto)
  enum status: %i(initial error preview approved rejected)

  # validates_numericality_of :edition, greater_than: 0, on: :update
  validates_numericality_of :quantity, greater_than_or_equal_to: 0
  # validates_presence_of :title, on: :update
  validates_presence_of :height, :width, if: -> { error.blank? }, on: :update
  validates_presence_of :user_id

  before_save :adjust_status
  before_save :generate_urls

  def full_url(version = 'preview', max_width: 600)
    "https://#{ENV['PHOTO_CDN_HOST']}/#{url(version, max_width: max_width)}"
  end

  def start_price
    prices.select(&:positive?).min
  end

  def url(version = 'preview', crop_data: nil, max_width: 600)
    return if height.to_i.zero? || width.to_i.zero?
    w, h = if max_width
             x = [max_width, width].min
             [x, x * height / width]
           elsif version == 'preview'
             [1080, 1080]
           else
             [width, height]
           end
    cropping = version != 'preview' && (c = crop_data || crop[version.to_s]) ? c.values_at('w', 'h', 'x', 'y') : []
    payload = ([id] + [w, h] + cropping).join('-')
    sign = Digest::MD5.hexdigest(payload + 'osin')
    Base64.strict_encode64([sign, payload].join('-'))
  end

  def created=(value)
    value /= 1000 if value > (1 << 31)
    super(value)
  end

  def price_list
    prices.each_with_index.select { |price, _| price.positive? }
  end

  private

  def adjust_status
    self.status = 'error' if !error? && error.present?

    if !initial? && colorspace.blank?
      self.status = 'error'
      self.error = 'ICC profile is blank' if error.blank?
    end

    self.status = 'preview' if status_was == 'approved'

    true
  end

  def generate_urls
    crop.each do |name, data|
      urls[name] = url(nil, crop_data: data)
    end
  end
end
