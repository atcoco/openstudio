# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :set_user

  MODES = {
    'full' => 1200
  }.freeze

  layout 'profile'

  def photos
    respond_to do |format|
      format.json do
        photos = @user.photos.send(@user == current_user ? :available : :approved)
        data = photos.order(created_at: :desc).map do |photo|
          {
            aspect: 1000 * photo.height / photo.width,
            id: photo.id,
            price: photo.prices.select(&:positive?).min,
            title: photo.title,
            url: photo.full_url(max_width: MODES[params[:width]] || 600)
          }
        end
        render json: data
      end
      format.any { head :not_found }
    end
  end

  def show
    @photos = @user.photos.send(@user == current_user ? :available : :approved)
    @hero = params[:q].present? && @photos.find_by(id: params[:q]) || @photos.take
    flash[:notice] = 'Profile is not been published yet' if !@user.published? && policy(model).not_published_alert?
  end

  private

  def model
    Profile.new(@user)
  end

  def set_user
    @user = User.where(id: params[:id]).or(User.where(username: params[:id])).first!
    authorize model
  end
end
