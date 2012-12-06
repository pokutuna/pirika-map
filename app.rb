# -*- coding: utf-8 -*-

require 'sinatra'
require 'haml'
require 'active_record'
require 'json'

DB_NAME = 'pirikas.db'
ActiveRecord::Base.establish_connection(
  :adapter  => 'sqlite3',
  :database => File.join(File.dirname(__FILE__), 'db', DB_NAME)
  )

RESULT_MAX = 10000

class Pirika < ActiveRecord::Base
  def to_h
    { :datetime => datetime, :lat => latitude, :lon => longitude, :key => key }
  end
end

get '/' do
  haml :index
end

get '/api' do
  lat = [params['latNE'], params['latSW']]
  lon = [params['lonNE'], params['lonSW']]

  data = Pirika.where(
    ':min_lat <= latitude AND latitude <= :max_lat AND :min_lon <= longitude AND :max_lon <= longitude', { :min_lat => lat.min, :max_lat => lat.max, :min_lon => lon.min, :max_lon => lon.max }).limit(RESULT_MAX)

  results = {
    :request => params['request'],
    :data    => data.map(&:to_h),
    :size    => data.length
  }

  return results.to_json
end
