# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit

  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :detect_device_variant

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  impersonates :user

  private

  def after_sign_in_path_for(user)
    user.photos.exists? ? dashboard_path : onboarding_root_path
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i(first_name username))
  end

  def detect_device_variant
    request.variant = :mobile if browser.device.mobile?
  end

  def user_not_authorized
    flash[:alert] = 'You are not authorized to perform this action.'
    redirect_back fallback_location: root_path
  end
end
