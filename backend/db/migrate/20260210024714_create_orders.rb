class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.string :reference_type
      t.string :reference_id
      t.string :title
      t.integer :status
      t.integer :total_cents
      t.string :currency
      t.string :notify_email
      t.jsonb :metadata

      t.timestamps
    end
  end
end
