# frozen_string_literal: true

module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def disconnect_facebook
      return head(:not_found) unless current_user
      current_user.oauth.delete('facebook')
      current_user.save
      head :ok
    end

    def facebook
      if user.persisted?
        sign_in_and_redirect user, event: :authentication # this will throw if @user is not activated
        set_flash_message(:notice, :success, kind: 'Facebook') if is_navigational_format?
      else
        session['devise.facebook_data'] = request.env['omniauth.auth']
        flash[:alert] = user.errors.full_messages.join('. ')
        redirect_to new_user_registration_url
      end
    end

    def failure
      redirect_to root_path
    end

    def instagram
      if user.persisted?
        sign_in_and_redirect user, event: :authentication # this will throw if @user is not activated
        set_flash_message(:notice, :success, kind: 'Instagram') if is_navigational_format?
      else
        session['devise.instagram_data'] = request.env['omniauth.auth']
        redirect_to new_user_registration_url
      end
    end

    private

    def oauth
      request.env['omniauth.auth']
    end

    def user
      @user ||= if current_user
                  current_user.oauth = oauth
                  current_user.tap(&:save)
                else
                  User.from_omniauth(oauth)
                end
    end
  end
end
