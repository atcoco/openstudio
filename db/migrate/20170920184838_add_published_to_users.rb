class AddPublishedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :published_at, :datetime
  end
end
