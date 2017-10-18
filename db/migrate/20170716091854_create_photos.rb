# frozen_string_literal: true

class CreatePhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :photos, id: :uuid do |t|
      t.belongs_to :user, foreign_key: true, type: :uuid
      t.integer :status, default: 0, null: false
      t.string :error
      t.integer :height
      t.integer :width
      t.string :title, null: false
      t.text :description
      t.integer :edition, default: 0, null: false
      t.integer :quantity, default: 0, null: false
      t.integer :prices, array: true, default: [], null: false
      t.integer :paper, default: 0, null: false
      t.datetime :status_changed_at
      t.jsonb :crop, default: {}, null: false

      t.timestamps
    end
  end
end
