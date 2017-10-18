# frozen_string_literal: true

class PhotoDecorator < SimpleDelegator
  SIZE_SYMBOLS = {
    cm: 'cm',
    in: '″'
  }.freeze

  def sizes_human(dimension = :in, append_symbol: true)
    d = dimension.to_sym
    s = append_symbol ? SIZE_SYMBOLS[d] : ''
    Photo::SIZES[d].values_at(*sizes.sort).map { |x| [x, s].join }
  end
end
