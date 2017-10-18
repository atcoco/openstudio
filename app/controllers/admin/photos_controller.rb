# frozen_string_literal: true

module Admin
  class PhotosController < BaseController
    before_action :set_photo, except: :index

    def approve
      @photo.approved!
      redirect_back fallback_location: root_path
    end

    def index
      @photos = Photo.includes(:user).order(created_at: :desc)

      if params[:user].present?
        @user = User.where(id: params[:user]).or(User.where(username: params[:user])).take
        @photos = @photos.where(user_id: @user.id) if @user
      end

      @photos = case params[:show]
                when 'approved' then @photos.approved
                when 'unapproved' then @photos.where.not(status: ::Photo.statuses[:approved])
                else @photos
                end

      @photos = @photos.page(params[:page]).per(5)
    end

    def reject
      @photo.update_columns(rejection_reason: params[:reason], status: 'rejected')
      redirect_back fallback_location: root_path
    end

    private

    def set_photo
      @photo = Photo.find params[:id]
    end
  end
end
