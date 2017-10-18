# frozen_string_literal: true

class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def bio
    respond_to do |format|
      format.any { redirect_to action: :show }
      format.json do
        if request.get?
          render json: { bio: current_user.bio, born: current_user.born, education: current_user.education }
        elsif current_user.update(permitted_attributes(current_user))
          head :created
        else
          render json: current_user.errors, status: :conflict
        end
      end
    end
  end

  def certificate
    respond_to do |format|
      format.any { redirect_to action: :show }
      format.json do
        if request.get?
        end
      end
    end
  end

  def link_social
    case params[:type]
    when 'facebook'
      current_user.with_lock do
        current_user.oauth['facebook'] = { uid: params[:uid] }
        current_user.save
      end
    end
    render json: { social: current_user.oauth.keys }
  end

  def settings
    respond_to do |format|
      format.any { redirect_to action: :show }
      format.json do
        if request.get?
          render json: {
            country: current_user.country,
            email: current_user.email,
            first_name: current_user.first_name,
            last_name: current_user.last_name,
            signatures: current_user.signatures.map(&:url),
            social: current_user.oauth.keys,
            subscribed: current_user.subscribed?,
            username: current_user.username
          }
        elsif current_user.update(permitted_attributes(current_user))
          render json: { url: dashboard_path }
        else
          render json: current_user.errors, status: :conflict
        end
      end
    end
  end

  def show
    @photos = current_user.photos.uploaded.order(created_at: :desc)
    @show_welcome = session.delete(:just_added).present? || params.key?(:welcome)
  end

  def unlink_social
    current_user.oauth.delete(params[:id])
    render current_user.save ? :no_content : :conflict
  end
end
