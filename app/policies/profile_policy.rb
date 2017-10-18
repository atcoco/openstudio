# frozen_string_literal: true

class ProfilePolicy < ApplicationPolicy
  def not_published_alert?
    user.id == record.id or user.admin?
  end

  def photos?
    show?
  end

  def show?
    record.published? or
      user&.id == record.id or
      user&.admin?
  end
end
