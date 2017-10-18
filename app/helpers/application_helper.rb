module ApplicationHelper
  def flash_container_class_for(type)
    case type.to_s
    when 'alert' then 'bg-washed-red dark-red'
    when 'error' then 'bg-washed-red dark-red'
    when 'notice' then 'bg-ocean white'
    when 'success' then 'bg-washed-green dark-green'
    when 'ontop' then 'bg-washed-green dark-green'
    end
  end
end
