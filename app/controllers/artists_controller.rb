class ArtistsController < ApplicationController
  before_action :set_artist, only: [:destroy]

  def new
    @artist = Artist.new
  end

  def create
    @artist = Artist.new(artist_params)
    if @artist.save
      redirect_to dashboard_path, notice: 'Artist was successfully created.'
    else
      render :new
    end
  end

  def index
    @artists = Artist.all
  end

  def destroy
    @artist.destroy
    respond_to do |format|
      format.html { redirect_to dashboard_path, notice: 'Artist was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  private

  def set_artist
    @artist = Artist.find(params[:id])
  end

  def artist_params
    params.require(:artist).permit(:name, :bio, :website)
  end
end
