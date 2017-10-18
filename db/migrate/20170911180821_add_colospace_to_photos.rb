class AddColospaceToPhotos < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :colorspace, :string
  end
end
