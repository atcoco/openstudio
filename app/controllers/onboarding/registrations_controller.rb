# frozen_string_literal: true

module Onboarding
  class RegistrationsController < Devise::RegistrationsController
    layout 'onboarding'

    private

    def after_inactive_sign_up_path_for(resource)
      after_sign_up_path_for(resource)
    end

    def after_sign_up_path_for(_)
      onboarding_root_path
    end
  end
end
