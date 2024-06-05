Geocoder.configure(
  units: :km,
  lookup: :nominatim,
  api_key: ENV['MAPBOX_API_KEY'],
  use_https: true
)
