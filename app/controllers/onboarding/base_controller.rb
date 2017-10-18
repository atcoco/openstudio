# frozen_string_literal: true

module Onboarding
  class BaseController < ApplicationController
    before_action :register_user, unless: -> { user_signed_in? }

    layout 'onboarding'

    def create
      photo = current_user.photos.find_or_initialize_by(id: submit_params[:id])
      photo.prices = submit_params[:price]
      photo.update(submit_params.except(:created, :price))

      respond_to do |format|
        format.json do
          session[:just_added] = true
          render json: { location: dashboard_path }
        end
      end
    end

    def index
      @user_info = JSON.dump instagram: current_user.oauth.dig('instagram', 'username')
    end

    private

    def submit_params
      params.permit(
        :created,
        :description,
        :edition,
        :height,
        :id,
        :paper,
        :quantity,
        :title,
        :width,
        crop: {},
        price: []
      )
    end

    def register_user
      redirect_to onboarding_registrations_path
    end
  end
end
