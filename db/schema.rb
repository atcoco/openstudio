# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170928071901) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pgcrypto"
  enable_extension "hstore"

  create_table "notify_subscriptions", force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_notify_subscriptions_on_email", unique: true
  end

  create_table "photos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.integer "status", default: 0, null: false
    t.string "error"
    t.integer "height"
    t.integer "width"
    t.string "title", null: false
    t.text "description"
    t.integer "edition", default: 0, null: false
    t.integer "quantity", default: 0, null: false
    t.integer "prices", default: [], null: false, array: true
    t.integer "paper", default: 0, null: false
    t.datetime "status_changed_at"
    t.jsonb "crop", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "colorspace"
    t.string "icc_profile"
    t.hstore "urls", default: {}, null: false
    t.integer "created", default: 0, null: false
    t.datetime "deleted_at"
    t.string "rejection_reason"
    t.index ["user_id"], name: "index_photos_on_user_id"
  end

  create_table "signatures", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.boolean "active", default: false, null: false
    t.integer "width", default: 0
    t.integer "height", default: 0
    t.string "format"
    t.datetime "created_at", null: false
    t.index ["user_id"], name: "index_signatures_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "oauth", default: {}, null: false
    t.string "first_name"
    t.string "last_name"
    t.string "username", null: false
    t.text "bio"
    t.datetime "deleted_at"
    t.integer "role", default: 0, null: false
    t.datetime "subscribed_at"
    t.integer "born"
    t.string "education"
    t.string "country"
    t.datetime "published_at"
    t.index "oauth jsonb_path_ops", name: "index_users_on_oauth", using: :gin
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "photos", "users"
  add_foreign_key "signatures", "users"
end
