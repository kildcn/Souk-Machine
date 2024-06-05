// app/javascript/controllers/map_controller.js

import { Controller } from "@hotwired/stimulus";
import mapboxgl from 'mapbox-gl';

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/liankee/clwrx5r3s00lf01po7lke6w7z"
    });

    this.addMarkers();
    this.fitBoundsToMarkers();
    this.addCurrentLocation();

    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  addMarkers() {
    this.markersValue.forEach((marker) => {
      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';

      // Create the new marker with the custom element
      const newMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(this.map);

      // Add click event listener to the custom marker element
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openPopup(marker.info_window_html);
      });
    });
  }

  fitBoundsToMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.markersValue.forEach(marker => bounds.extend([marker.lng, marker.lat]));
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  }

  addCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(this.map);
          this.map.flyTo({ center: [lng, lat], zoom: 2 });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  openPopup(content) {
    const overlay = document.createElement('div');
    overlay.className = 'info-window-popup-overlay';
    overlay.innerHTML = `
      <div class="info-window-popup show">
        ${content}
        <button class="close-button">X</button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    const closeButton = overlay.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        overlay.remove();
      });
    }
  }

  handleDocumentClick(event) {
    const overlay = document.querySelector('.info-window-popup-overlay');
    if (overlay && !overlay.contains(event.target)) {
      overlay.remove();
    }
  }
}
