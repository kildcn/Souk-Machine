class SubmissionsController < ApplicationController
  before_action :set_submission, only: [:destroy]

  def index
    @submissions = Submission.all
  end

  def create
    @submission = Submission.new(submission_params)

    # Store the path of the uploaded file before saving the submission
    uploaded_file_path = submission_params[:file].tempfile.path

    if @submission.save
      public_id = "videos/#{SecureRandom.uuid}"

      if uploaded_file_path && File.exist?(uploaded_file_path)
        begin
          cloudinary_file = Cloudinary::Uploader.upload(uploaded_file_path,
                                                        resource_type: 'video',
                                                        eager: [{ streaming_profile: 'full_hd', format: 'm3u8' }],
                                                        public_id: public_id)

          cloudinary_url = cloudinary_file['secure_url']

          if cloudinary_url.present?
            if @submission.update_column(:file, cloudinary_url)
              redirect_to root_path, notice: 'Submission successfully uploaded.'
            else
              flash.now[:alert] = 'File upload failed. Please try again.'
              render 'pages/home', status: :unprocessable_entity
            end
          else
            @submission.destroy
            flash.now[:alert] = 'File upload failed. Cloudinary response invalid.'
            render 'pages/home', status: :unprocessable_entity
          end
        rescue => e
          @submission.destroy
          flash.now[:alert] = "File upload failed: #{e.message}"
          render 'pages/home', status: :unprocessable_entity
        end
      else
        @submission.destroy
        flash.now[:alert] = 'File upload failed. Please try again.'
        render 'pages/home', status: :unprocessable_entity
      end
    else
      render 'pages/home', status: :unprocessable_entity
    end
  end

  def destroy
    @submission.destroy
    respond_to do |format|
      format.html { redirect_to dashboard_path, notice: 'Submission was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  private

  def set_submission
    @submission = Submission.find(params[:id])
  end

  def submission_params
    params.require(:submission).permit(:file, :address, :latitude, :longitude, :language, :details)
  end
end
