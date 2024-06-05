class CreateSubmissions < ActiveRecord::Migration[7.1]
  def change
    create_table :submissions do |t|
      t.string :file
      t.float :latitude
      t.float :longitude
      t.string :language
      t.text :details

      t.timestamps
    end
  end
end
