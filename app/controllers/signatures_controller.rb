# frozen_string_literal: true

class SignaturesController < ApplicationController
  before_action :authenticate_user!

  def new
    respond_to do |format|
      format.json do
        model = current_user.signatures.create(active: false)
        sign = Aws::S3::Bucket.new(name: ENV['AWS_SIGNATURES_BUCKET']).presigned_post(key: model.id)
        sign.content_type(params[:type].presence || 'image/jpeg')
        render json: {
          payload: sign.fields,
          url: sign.url
        }
      end
      format.any { head :not_found }
    end
  end

  def update
    respond_to do |format|
      format.json do
        current_user.signatures.rewhere(active: false).find(params[:id])&.update(active: true)
        head :ok
      end
      format.any { head :not_found }
    end
  end
end
