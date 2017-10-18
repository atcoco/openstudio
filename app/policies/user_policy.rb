# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def account_settings?
    bio?
  end

  def bio?
    user.admin? || record.id == user.id
  end

  def photos?
    true
  end

  def show?
    true
    # user.admin? || record.id == user.id
  end

  def permitted_attributes
    %i(bio born country education first_name last_name subscribed username)
  end

  def update?
    show?
  end
end
