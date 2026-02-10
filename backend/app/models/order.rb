class Order < ApplicationRecord
  enum :status, {
    pending: 0,
    processing: 1,
    completed: 2,
    cancelled: 3
  }, prefix: true

  validates :title, presence: true
  validates :status, presence: true

  validates :total_cents,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  validates :currency,
            presence: true,
            length: { is: 3 },
            format: { with: /\A[A-Z]{3}\z/ }

  validates :notify_email,
            allow_nil: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }
end
