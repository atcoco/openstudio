# frozen_string_literal: true

class ComingSoonController < ApplicationController
  def notify
    email = params[:email].to_s.strip
    if email['@']
      NotifySubscription.create(email: email)
      subscribe(email)
    end
    flash[:notice] = 'Thank you for you interest! Keep a close eye on your email for more details on our upcoming launch.'
    redirect_to root_path
  end

  private

  def subscribe(email)
    return if Rails.application.secrets.dig(:mailchimp, :list_id).blank?

    Gibbon::Request
      .lists(Rails.application.secrets[:mailchimp][:list_id])
      .members(Digest::MD5.hexdigest email)
      .upsert(
        body: {
          email_address: email,
          status: 'subscribed'
        }
      )
  end
end
