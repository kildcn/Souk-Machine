Rails.application.routes.draw do
  devise_for :users
  get 'dashboard/index'
  root 'pages#home'

  post 'submit', to: 'submissions#create'
  get 'about', to: 'pages#about'
  get 'about_us', to: 'pages#about_us', as: 'about_us'

  resources :submissions, only: [:create, :index, :destroy]
  resources :artists, only: [:new, :create, :index, :destroy]

  get 'dashboard', to: 'dashboard#index', as: 'dashboard'
end
