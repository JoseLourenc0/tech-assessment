module Orders
  class Create
    def initialize(params)
      @params = params
    end

    def call
      Order.transaction do
        order = Order.create!(@params)
        OrderMailer.created(order).deliver_later if order.notify_email.present?
        order
      end
    end
  end
end
