class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :check_if_admin

  def index
    @artists = Artist.all
    @submissions = Submission.all
  end

  private

  def check_if_admin
    redirect_to root_path, alert: 'Access Denied' unless current_user&.admin?
  end
end
