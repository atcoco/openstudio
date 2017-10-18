# frozen_string_literal: true

Gibbon::Request.api_key = Rails.application.secrets.dig(:mailchimp, :api_key)
