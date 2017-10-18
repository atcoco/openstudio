# frozen_string_literal: true

class Profile < SimpleDelegator
  def self.policy_class
    ProfilePolicy
  end
end
