# frozen_string_literal: true

module Onboarding
  class ImportsController < BaseController
    def index; end

    def instagram
      handle = params[:handle].to_s.gsub(/[^a-z0-9_\.]+/, '')[0..255].presence
      # handle ||= current_user.oauth.dig('instagram', 'username').presence

      if handle
        data = JSON.parse(open("http://instagram.com/#{handle}/?__a=1").read) rescue {}
        media = (data.dig('user', 'media', 'nodes') || [])
                  .select { |x| x['is_video'] == false }
                  .sort { |a, b| b.dig('likes', 'count').to_i <=> a.dig('likes', 'count').to_i }
                  .map do |x|
                    { height: x.dig('dimensions', 'height').to_i,
                      id: SecureRandom.uuid,
                      likes: x.dig('likes', 'count').to_i,
                      thumb: x['thumbnail_src'],
                      url: x['display_src'],
                      width: x.dig('dimensions', 'width').to_i }
                  end
        respond_to do |format|
          format.json { render json: media }
          format.any { head :no_content }
        end
      else
        store_location_for(:user, onboarding_root_path)
        redirect_to user_instagram_omniauth_authorize_path
      end
    end
  end
end
