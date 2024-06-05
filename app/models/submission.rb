# app/models/submission.rb
class Submission < ApplicationRecord
  mount_uploader :file, VideoUploader

  geocoded_by :address
  after_validation :geocode, if: :address_changed?

  # Define the address_changed? method correctly
  def address_changed?
    will_save_change_to_address?
  end
end
