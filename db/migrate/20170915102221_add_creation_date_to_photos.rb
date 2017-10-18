class AddCreationDateToPhotos < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :created, :integer, default: 0, null: false
  end
end
