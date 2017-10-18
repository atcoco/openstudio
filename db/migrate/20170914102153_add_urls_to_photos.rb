class AddUrlsToPhotos < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :urls, :hstore, default: '', null: false
  end
end
