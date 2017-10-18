class CreateSignatures < ActiveRecord::Migration[5.1]
  def change
    create_table :signatures, id: :uuid do |t|
      t.belongs_to :user, index: true, foreign_key: true, type: :uuid
      t.boolean :active, default: false, null: false
      t.integer :width, default: 0
      t.integer :height, default: 0
      t.string :format

      t.datetime :created_at, null: false
    end
  end
end
