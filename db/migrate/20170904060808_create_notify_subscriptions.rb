# frozen_string_literal: true

class CreateNotifySubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :notify_subscriptions do |t|
      t.string :email, null: false

      t.timestamps
    end

    add_index :notify_subscriptions, :email, unique: true
  end
end
