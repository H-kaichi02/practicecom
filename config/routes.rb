Rails.application.routes.draw do
  get "hadouken", to: "commands#hadouken"
  root to: 'homes#index'
  resources :home
end
