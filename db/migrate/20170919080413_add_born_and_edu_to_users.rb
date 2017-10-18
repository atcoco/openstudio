class AddBornAndEduToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :born, :integer, default: 0, null: false
    add_column :users, :education, :string
  end
end
