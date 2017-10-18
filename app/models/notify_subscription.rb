# frozen_string_literal: true

class NotifySubscription < ApplicationRecord
  validates :email, presence: true, uniqueness: true
end
