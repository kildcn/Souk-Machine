// app/javascript/controllers/index.js
import { application } from "./application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
import AddressAutocompleteController from "./address_autocomplete_controller"

eagerLoadControllersFrom("controllers", application)
application.register("address-autocomplete", AddressAutocompleteController)

console.log("Registered address-autocomplete controller:", application.getControllerForElementAndIdentifier(document.querySelector("[data-controller='address-autocomplete']"), "address-autocomplete"));
