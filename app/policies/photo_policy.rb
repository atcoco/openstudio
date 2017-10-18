# frozen_string_literal: true

class PhotoPolicy < ApplicationPolicy
  def edit?
    update?
  end

  def permitted_attributes
    [
      :created,
      :description,
      :paper,
      :quantity,
      :title,
      prices: []
    ]
  end

  def update?
    user.admin? || record.user_id == user.id
  end
end
