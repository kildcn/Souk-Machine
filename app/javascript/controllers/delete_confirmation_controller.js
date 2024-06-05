import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="delete-confirmation"
export default class extends Controller {
  static targets = ["item"]

  connect() {
    // This function will be called when the controller is connected to the DOM
  }

  delete(event) {
    event.preventDefault()
    if (confirm("Are you sure you want to delete this?")) {
      const url = event.currentTarget.href
      fetch(url, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
          "Accept": "application/json"
        }
      }).then(response => {
        if (response.ok) {
          this.itemTarget.remove()
        } else {
          alert("Failed to delete the artist.")
        }
      }).catch(() => {
        alert("Failed to delete the artist.")
      })
    }
  }
}
