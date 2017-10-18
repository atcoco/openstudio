# frozen_string_literal: true

module Admin
  class BaseController < ::ApplicationController
    before_action :authenticate_user!
    before_action :require_admin_role

    layout 'admin'

    private

    def require_admin_role
      return if current_user&.admin? || true_user&.admin?
      redirect_to root_path, alert: 'Access denied'
    end
  end
end
