# -*- coding: utf-8 -*-

require 'sinatra'
require 'haml'
require 'active_record'
require 'json'

DB_NAME = 'pirikas.db'
ActiveRecord::Base.establish_connection(
  :adapter  => 'sqlite3',
  :database => File.join(File.dirname(__FILE__), 'db', DB_NAME),
  :pool     => 10
  )

PAGE_LIMIT = 500

class Pirika < ActiveRecord::Base
  def to_h
    { :datetime => datetime, :lat => latitude, :lng => longitude, :key => key }
  end
end

get '/' do
  haml :index
end

get '/api' do

  page = params['page'].to_i || 0
  lat  = [params['latNE'], params['latSW']]
  lon  = [params['lonNE'], params['lonSW']]

  data = Pirika.where(':min_lat <= latitude AND latitude <= :max_lat AND :min_lon <= longitude AND longitude <= :max_lon', { :min_lat => lat.min, :max_lat => lat.max, :min_lon => lon.min, :max_lon => lon.max }).limit(PAGE_LIMIT + 1).offset(page * PAGE_LIMIT).order(:datetime)

  has_next = false
  if data.length == (PAGE_LIMIT + 1)
    data.pop
    has_next = true
  end

  results = {
    :request => params['request'],
    :data    => data.map(&:to_h),
    :size    => data.length,
    :page    => page,
    :hasNext => has_next
  }

  return results.to_json
end
