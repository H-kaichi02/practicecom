class CommandsController < ApplicationController
  def show
    render params[:page]
  end
end
