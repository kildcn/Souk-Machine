class AddAddressToSubmissions < ActiveRecord::Migration[7.1]
  def change
    add_column :submissions, :address, :string
  end
end
