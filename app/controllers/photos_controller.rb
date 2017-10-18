# frozen_string_literal: true

class PhotosController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :meta_callback
  before_action :authenticate_user!, except: %i(meta_callback)

  DIR = %w(public photos).freeze

  def create
    src = params[:file]
    id = SecureRandom.uuid
    dpath = DIR + [id]
    path = Rails.root.join(*dpath)
    FileUtils.mkdir_p(path)
    apath = File.join(path, src.original_filename)
    FileUtils.cp(src.path, apath)
    data = JSON.parse(`node #{Rails.root.join('process.js')} '#{apath}'`)
    data['id'] = id
    data['src'] = File.join('/photos', id, 'preview.jpg')
    render json: data
  end

  def edit
    respond_to do |format|
      format.any { head :not_found }
      format.json do
        if request.get?
          render json: {
            created: photo.created * 1000,
            description: photo.description,
            paper: photo.paper_before_type_cast,
            prices: photo.prices,
            quantity: photo.quantity,
            title: photo.title
          }
        elsif photo.update(permitted_attributes(photo))
          head :ok
        else
          render json: photo.errors, status: :conflict
        end
      end
    end
  end

  def meta_callback
    photo = Photo.initial.find_by(id: params[:id])
    return head :ok unless photo
    photo.update(
      colorspace: (meta_params[:ispace].presence || meta_params[:space]),
      error: meta_params[:error].presence,
      height: meta_params[:height],
      icc_profile: meta_params[:idesc],
      status: (meta_params[:error].present? ? 'error' : 'preview'),
      width: meta_params[:width]
    )
    head :ok
  end

  def new
    respond_to do |format|
      format.json do
        photo = current_user.photos.initial.create(title: '')
        sign = Aws::S3::Bucket.new(name: ENV['AWS_PHOTO_BUCKET']).presigned_post(key: photo.id)
        render json: {
          payload: sign.fields,
          url: sign.url
        }
      end
      format.any { head :not_found }
    end
  end

  def status
    respond_to do |format|
      format.json do
        photo = current_user.photos
                  .select(:colorspace, :crop, :error, :height, :icc_profile, :id, :status, :width)
                  .where(id: params[:id])
                  .take
        return head :not_found unless photo
        return head :no_content if photo.status == 'initial'
        render json: {
          error: photo.error,
          height: photo.height,
          id: photo.id,
          profile: photo.icc_profile,
          space: photo.colorspace,
          url: photo.full_url,
          width: photo.width
        }
      end
      format.any { head :not_found }
    end
  end

  def status_dev
    respond_to do |format|
      format.json do
        photo = current_user.photos.find_by(id: params[:id])
        if photo && photo.created_at > 5.seconds.ago
          return head :no_content if photo.status == 'initial'
        elsif photo.nil?
          return head :not_found
        else
          photo.update(
            colorspace: 'srgb',
            error: nil,
            height: 10_000,
            icc_profile: 'some',
            status: 'preview',
            width: 10_000
          )
          status
        end
      end
      format.any { head :not_found }
    end
  end

  private

  def meta_params
    params.permit(:error, :height, :id, :idesc, :ispace, :space, :width)
  end

  def photo
    @photo ||= authorize Photo.find(params[:id])
  end
end
