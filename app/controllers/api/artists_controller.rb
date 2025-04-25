module Api
  class ArtistsController < ApplicationController
    def index
      @artists = Artist.all
      render json: @artists.as_json(only: [:id, :name, :bio, :website])
    end
  end
end
