class AddDeletedToPhotos < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :deleted_at, :datetime
  end
end
