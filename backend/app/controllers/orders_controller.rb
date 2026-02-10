class OrdersController < ApplicationController
  before_action :set_order, only: %i[show update destroy]

  def index
    scope = Order.order(created_at: :desc)
    scope = scope.where(status: params[:status]) if params[:status].present?

    orders = scope.limit(per).offset(offset)

    render json: {
      data: orders.map { OrderSerializer.new(_1).as_json },
      meta: { page:, per:, total: scope.count }
    }
  end

  def stats
    render json: { count: Order.count }
  end

  def show
    render json: { data: OrderSerializer.new(@order).as_json }
  end

  def create
    order = Orders::Create.new(order_params).call
    render json: { data: OrderSerializer.new(order).as_json }, status: :created
  end

  def update
    @order.update!(order_params)
    render json: { data: OrderSerializer.new(@order).as_json }
  end

  def destroy
    @order.destroy!
    head :no_content
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :reference_type,
      :reference_id,
      :title,
      :status,
      :total_cents,
      :currency,
      :notify_email,
      metadata: {}
    )
  end
end
