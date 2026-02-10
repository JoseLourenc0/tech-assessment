require 'test_helper'

class OrdersControllerTest < ActionDispatch::IntegrationTest
  test 'GET /orders returns paginated list' do
    3.times { |i| Order.create!(title: "Order #{i}", status: :pending, total_cents: 1000, currency: 'USD') }

    get '/orders', params: { page: 1, per: 2 }

    assert_response :success
    body = JSON.parse(response.body)

    assert body.key?('data')
    assert body.key?('meta')
    assert_equal 2, body['data'].size
    assert_equal 1, body['meta']['page']
    assert_equal 2, body['meta']['per']
    assert_operator body['meta']['total'], :>=, 3
  end

  test 'POST /orders creates order and enqueues email when notify_email present' do
    assert_enqueued_jobs 1, only: ActionMailer::MailDeliveryJob do
      post '/orders', params: {
        order: {
          title: 'Marketplace order',
          status: 'pending',
          total_cents: 25990,
          currency: 'USD',
          notify_email: 'test@example.com',
          reference_type: 'inventory_sku',
          reference_id: 'SKU-125',
          metadata: { channel: 'marketplace' }
        }
      }, as: :json
    end

    assert_response :created
    body = JSON.parse(response.body)

    assert body['data']['id'].present?
    assert_equal 'Marketplace order', body['data']['title']
    assert_equal 'pending', body['data']['status']
  end

  test 'POST /orders does not enqueue email when notify_email is blank' do
    assert_enqueued_jobs 0, only: ActionMailer::MailDeliveryJob do
      post '/orders', params: {
        order: {
          title: 'No email order',
          status: 'pending',
          total_cents: 1000,
          currency: 'USD',
          notify_email: nil
        }
      }, as: :json
    end

    assert_response :created
  end

  test 'GET /orders/stats returns count' do
    Order.delete_all
    5.times { |i| Order.create!(title: "Order #{i}", status: :pending, total_cents: 1000, currency: 'USD') }

    get '/orders/stats'

    assert_response :success
    body = JSON.parse(response.body)

    assert_equal 5, body['count']
  end

  test 'POST /orders returns 422 when title missing' do
    post '/orders', params: { order: { status: 'pending', total_cents: 1000, currency: 'USD' } }, as: :json

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)

    assert_equal 'validation_error', body['error']
    assert body['details'].any?
  end

  test 'GET /orders/:id returns 404 when not found' do
    get '/orders/99999999'
    assert_response :not_found

    body = JSON.parse(response.body)
    assert_equal 'not_found', body['error']
  end

  test 'GET /orders returns newest first' do
    o1 = Order.create!(title: 'Old', status: :pending, total_cents: 1000, currency: 'USD')
    sleep 0.01
    o2 = Order.create!(title: 'New', status: :pending, total_cents: 1000, currency: 'USD')

    get '/orders', params: { page: 1, per: 10 }

    assert_response :success
    body = JSON.parse(response.body)

    assert_equal o2.id, body['data'][0]['id']
    assert_equal o1.id, body['data'][1]['id']
  end
end
