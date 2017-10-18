# frozen_string_literal: true

# rubocop:disable Metrics/BlockLength
Rails.application.routes.draw do
  namespace :admin do
    resources :photos do
      member do
        get :approve
        get :reject
      end
    end
    resources :users do
      member do
        get :publish
        get :unpublish
        get :impersonate
      end
      get :stop_impersonating, on: :collection
    end
    root to: 'dashboard#show'
  end

  resource :dashboard, only: :show do
    put 'link', action: :link_social, as: 'link_social'
    delete 'unlink/:id', action: :unlink_social, as: 'unlink_social'
    get :bio
    put :bio
    get :settings
    put :settings
  end

  # resources :profiles, except: [:index] do
  #   collection do
  #     put 'link', action: :link_social, as: 'link_social'
  #     delete 'unlink/:id', action: :unlink_social, as: 'unlink_social'
  #   end
  #
  #   member do
  #     get :photos
  #   end
  # end

  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  devise_scope :user do
    delete '/users/auth/facebook', to: 'users/omniauth_callbacks#disconnect_facebook'

    namespace :onboarding, path: 'get-started' do
      resources :registrations, path: 'register', only: %i(create) do
        get '/', action: :new, on: :collection
      end
    end
    get :logout, to: 'devise/sessions#destroy'
  end

  resources :photos, only: %i(create edit new) do
    member do
      get :status, action: Rails.env.development? ? :status_dev : :status
      put :edit
      put :meta_callback
    end
  end

  resources :signatures, only: %i(new update)

  namespace :onboarding, path: 'get-started' do
    # resources :uploads, only: [:index]
    resources :imports, only: [] do
      get :instagram, on: :collection
    end

    post '/submit', to: 'base#create'

    get '*page', to: 'base#index'
    root to: 'base#index'
  end

  post '/notify', to: 'coming_soon#notify'

  resources :profiles, constraints: { id: %r{[^\/]+} }, only: :show, path: '/' do
    get :photos, on: :member
  end

  # root to: 'pages#home'
  root to: 'pages#coming_soon'
end
