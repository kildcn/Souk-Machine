# config/routes.rb
Rails.application.routes.draw do
  devise_for :users

  # Make React the root page
  root 'react#index'

  # Keep the original pages controller routes
  get 'home', to: 'pages#home'
  get 'about', to: 'pages#about'
  get 'about_us', to: 'pages#about_us', as: 'about_us'

  get 'dashboard/index'
  post 'submit', to: 'submissions#create'

  resources :submissions, only: [:create, :index, :destroy]
  resources :artists, only: [:new, :create, :index, :destroy]

  get 'dashboard', to: 'dashboard#index', as: 'dashboard'

  # Keep this route for compatibility
  get 'react', to: 'react#index'

  namespace :api do
    resources :submissions, only: [:index]
    resources :artists, only: [:index]
  end
end
