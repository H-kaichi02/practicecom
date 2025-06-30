# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "main", to: "main.js"
pin "P236236", to: "P236236.js"
pin "P214214", to: "P214214.js"
pin "ikkaiten", to: "ikkaiten.js"