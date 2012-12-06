# -*- coding: utf-8 -*-

require 'date'
require 'active_record'

raise ArgumentError, 'give Data.tsv' if ARGV.empty?

DB_NAME = 'pirikas.db'
SCHEMA  = 'schema.sql'

@tsv    = File.open(ARGV.shift).read
@db_dir = File.expand_path(File.join(File.dirname(__FILE__), '../db/'))

Dir.chdir(@db_dir)
`sqlite3 #{DB_NAME} < #{SCHEMA}`

ActiveRecord::Base.establish_connection(
  :adapter  => 'sqlite3',
  :database => File.join(@db_dir, DB_NAME)
)

class Pirika < ActiveRecord::Base; end

def parse_line(line)
  data = line.split("\t")
  return nil if data.length < 5

  begin
    datetime = DateTime.parse(data[0]).strftime('%Y-%m-%d %H:%M:%S')
    country = data[1]
    latitude, longitude = data[2].split(',').map(&:to_f)
    key = data[3].to_i
    address = data[4..-1]

    return {
      :datetime  => datetime,
      :country   => country,
      :latitude  => latitude,
      :longitude => longitude,
      :key       => key,
      :address   => address
    }

  rescue => e
    p e
    return nil
  end
end

lines = @tsv.split("\n")

lines.shift # drop first line

lines.each_slice(1000) { |lines|
  print '.'
  Pirika.transaction {
    lines.each do |l|
      data = parse_line(l)
      next if data == nil
      Pirika.new(data).save
    end
  }
}
