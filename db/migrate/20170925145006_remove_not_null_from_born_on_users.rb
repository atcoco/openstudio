class RemoveNotNullFromBornOnUsers < ActiveRecord::Migration[5.1]
  def change
    change_column_null :users, :born, true
  end
end
