import { Controller } from "@hotwired/stimulus";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';

export default class extends Controller {
  static values = { apiKey: String }
  static targets = ["address", "latitude", "longitude", "map"]

  connect() {
    console.log("Connecting address-autocomplete controller");

    if (!this.apiKeyValue) {
      console.error("Mapbox API key is missing.");
      return;
    }

    if (!this.hasAddressTarget) {
      console.error("Address target is missing.");
      return;
    }

    this.initializeGeocoder();
  }

  initializeGeocoder() {
    this.geocoder = new MapboxGeocoder({
      accessToken: this.apiKeyValue,
      types: "country,region,place,postcode,locality,neighborhood,address",
      placeholder: "Enter address",
      mapboxgl: mapboxgl
    });

    this.geocoder.addTo(this.addressTarget.parentNode); // Add to parent of addressTarget

    this.geocoder.on("result", event => this.setInputValues(event));
    this.geocoder.on("clear", () => this.clearInputValues());
  }

  setInputValues(event) {
    const coords = event.result.geometry.coordinates;
    this.latitudeTarget.value = coords[1];
    this.longitudeTarget.value = coords[0];
    this.addressTarget.value = event.result.place_name;
  }

  clearInputValues() {
    this.latitudeTarget.value = "";
    this.longitudeTarget.value = "";
    this.addressTarget.value = "";
  }
}
