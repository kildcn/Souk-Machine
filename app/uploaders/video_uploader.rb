class VideoUploader < CarrierWave::Uploader::Base
  include Cloudinary::CarrierWave

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  def extension_whitelist
    %w(mp4 mov avi mkv mp3 wav)
  end

  # Ensure the file is temporarily stored before uploading to Cloudinary
  def cache_dir
    "#{Rails.root}/tmp/uploads"
  end
end
