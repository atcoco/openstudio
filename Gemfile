# frozen_string_literal: true

ruby '2.4.1'

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'aws-sdk', '< 3'
gem 'bootstrap-sass', '~> 3.3.7'
gem 'bootstrap_form'
gem 'browser'
gem 'coffee-rails', '~> 4.2'
gem 'devise'
gem 'font-awesome-rails'
gem 'gibbon'
gem 'jbuilder', '~> 2.5'
gem 'kaminari'
gem 'lograge'
gem 'omniauth-facebook'
gem 'omniauth-instagram'
gem 'paranoia'
gem 'pg', '~> 0.18'
gem 'pretender'
gem 'puma', '~> 3.7'
gem 'pundit', github: 'elabs/pundit'
gem 'rails', '5.1.1'
gem 'sass-rails', '~> 5.0'
gem 'slim-rails'
gem 'uglifier', '>= 1.3.0'
gem 'webpacker'

group :development, :test do
  gem 'byebug', platforms: %i(mri mingw x64_mingw)
  gem 'capybara', '~> 2.13.0'
  gem 'selenium-webdriver'
end

group :development do
  gem 'foreman'
  gem 'guard-livereload', require: false
  gem 'letter_opener'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'mina', require: false
  gem 'web-console', '>= 3.3.0'
end
