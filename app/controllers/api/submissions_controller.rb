module Api
  class SubmissionsController < ApplicationController
    def index
      @submissions = Submission.all
      render json: @submissions.as_json(only: [:id, :file, :latitude, :longitude, :language, :details, :address])
    end
  end
end
