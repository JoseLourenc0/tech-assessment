class ApplicationController < ActionController::API
  include Paginatable

  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: 'not_found' }, status: :not_found
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { error: 'validation_error', details: e.record.errors.full_messages }, status: :unprocessable_entity
  end
end
