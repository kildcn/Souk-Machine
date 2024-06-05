class RemoveNotNullConstraintFromFileInSubmissions < ActiveRecord::Migration[7.1]
  def change
    change_column_null :submissions, :file, true
  end
end
