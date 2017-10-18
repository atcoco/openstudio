# frozen_string_literal: true

module Admin
  class UsersController < BaseController
    before_action :set_user, except: %i(index stop_impersonating)

    def impersonate
      impersonate_user(@user)
      redirect_back fallback_location: root_path
    end

    def index
      @users = User.order(created_at: :desc).page(params[:page])
    end

    def publish
      @user.publish!
      redirect_back fallback_location: root_path
    end

    def stop_impersonating
      stop_impersonating_user
      redirect_back fallback_location: root_path
    end

    def unpublish
      @user.unpublish!
      redirect_back fallback_location: root_path
    end

    private

    def set_user
      @user = User.where(id: params[:id]).or(User.where(username: params[:id])).first!
    end
  end
end
