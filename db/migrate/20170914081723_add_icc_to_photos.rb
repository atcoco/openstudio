class AddIccToPhotos < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :icc_profile, :string
  end
end
