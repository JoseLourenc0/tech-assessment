# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require 'faker'

Order.delete_all

40.times do |i|
  Order.create!(
    title: Faker::Commerce.product_name,
    status: Order.statuses.values.sample,
    total_cents: rand(500..50_000),
    currency: %w[USD BRL EUR].sample,
    notify_email: Faker::Internet.email,
    reference_type: [nil, 'inventory_ace_up', 'listing_id'].sample,
    reference_id: [nil, Faker::Alphanumeric.alphanumeric(number: 10).upcase].sample,
    metadata: [nil, { channel: %w[marketplace direct].sample, seed: true, n: i }].sample
  )
end
