class OrderSerializer
  def initialize(order)
    @order = order
  end

  def as_json(*)
    {
      id: @order.id,
      title: @order.title,
      status: @order.status,
      total_cents: @order.total_cents,
      currency: @order.currency,
      notify_email: @order.notify_email,
      reference_type: @order.reference_type,
      reference_id: @order.reference_id,
      metadata: @order.metadata,
      created_at: @order.created_at,
      updated_at: @order.updated_at
    }
  end
end
