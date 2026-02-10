class OrderMailer < ApplicationMailer
  def created(order)
    @order = order
    mail(to: @order.notify_email, subject: "Order created: #{@order.title}")
  end
end
