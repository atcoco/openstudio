# frozen_string_literal: true

class Signature < ApplicationRecord
  belongs_to :user

  scope :active, -> { where active: true }

  before_save :single_active

  def url
    Aws::S3::Object.new(ENV['AWS_SIGNATURES_BUCKET'], id).presigned_url(:get, expires_in: 5.minutes)
  end

  private

  def single_active
    return unless active
    self.class.where(user_id: user_id).where.not(id: id).update_all(active: false)
  end
end
