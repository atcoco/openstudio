class RemoveDefaultBornFromUsers < ActiveRecord::Migration[5.1]
  def change
    change_column_default(:users, :born, nil)
  end
end
