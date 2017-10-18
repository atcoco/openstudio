class AddOauthToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :oauth, :jsonb, default: {}, null: false
    add_index :users, :oauth, using: 'gin', order: 'jsonb_path_ops'
  end
end
