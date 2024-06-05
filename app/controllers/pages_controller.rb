class PagesController < ApplicationController
  def home
    @submissions = Submission.all
    @markers = @submissions.map do |submission|
      {
        lat: submission.latitude,
        lng: submission.longitude,
        info_window_html: render_to_string(partial: "info_window", locals: { submission: submission })
      }
    end
    @submission = Submission.new
  end

  def about_us
    @artists = Artist.all
  end
end
