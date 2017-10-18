class AddRejectionReasonToPhoto < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :rejection_reason, :string
  end
end
