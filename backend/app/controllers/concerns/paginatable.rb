module Paginatable
  private

  def page
    [params.fetch(:page, 1).to_i, 1].max
  end

  def per
    value = params.fetch(:per, 20).to_i
    value = 1 if value < 1
    value = 100 if value > 100
    value
  end

  def offset
    (page - 1) * per
  end
end
