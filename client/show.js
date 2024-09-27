import { Template } from "meteor/templating"
import { ReactiveDict } from "meteor/reactive-dict"
import { streamer } from "../both/streamer.js"
import { FlowRouter } from "meteor/ostrio:flow-router-extra"

import "./show.html"

Template.show.onCreated(function () {
  // Initialize the reactive dictionary to keep track of each client's pointer position.
  this.pointers = new ReactiveDict()

  // fuuuuu
  instance = this
})

streamer.on("message", function (message) {
  // Ensure the code only runs on the 'show' route to avoid unwanted executions.
  if (FlowRouter.getRouteName() === "show") {
    // console.log("Client:", message.pointer, "Coordinates:", message.coords)

    // Use the message.pointer to dynamically update the pointer position in the reactive dictionary.
    // This will add or update the client's position.
    instance.pointers.set(message.pointer, message.coords)
  }
})

Template.show.helpers({
  // Dynamically get the X position of a pointer based on its number.
  posX(number) {
    const pointers = Template.instance().pointers
    return pointers.get(number.hash.arg) ? pointers.get(number.hash.arg)[0] : 0
  },
  // Dynamically get the Y position of a pointer based on its number.
  posY(number) {
    const pointers = Template.instance().pointers
    return pointers.get(number.hash.arg) ? pointers.get(number.hash.arg)[1] : 0
  },
  // Get all client pointers for iteration if you want to display all.
  allPointers() {
    const pointers = Template.instance().pointers.all()
    return Object.keys(pointers).map((key) => ({
      number: key,
      coordsX: pointers[key][0],
      coordsY: pointers[key][1],
    }))
  },
})
