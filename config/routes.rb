Rails.application.routes.draw do
  get "hadouken", to: "commands#hadouken"
  get "/214214P", to: "commands#214214P", as: :command_214214P
  get "ikkaiten", to: "commands#ikkaiten"
  root to: 'homes#index'
  resources :home
end
