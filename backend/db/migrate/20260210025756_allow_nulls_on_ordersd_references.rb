class AllowNullsOnOrdersdReferences < ActiveRecord::Migration[7.2]
  def change
    change_column_null :orders, :reference_type, true
    change_column_null :orders, :reference_id, true
  end
end
