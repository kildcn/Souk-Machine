class ChangeFileColumnInSubmissions < ActiveRecord::Migration[7.1]
  def change
    change_column :submissions, :file, :string, null: false
  end
end
