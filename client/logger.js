import { Meteor } from "meteor/meteor"
import { Template } from "meteor/templating"
import { ReactiveDict } from "meteor/reactive-dict"
import { streamer } from "../both/streamer.js" // Import the streamer to send data
import "./logger.html"

// Subscribe to the 'clients' publication to track active clients
Meteor.subscribe("clients")

Template.logger.onCreated(function () {
  this.pointer = new ReactiveDict()
  this.pointer.set("X", 1)
  this.pointer.set("Y", 1)

  // Reactive variable to hold the assigned client number
  this.clientNumber = new ReactiveVar(null)

  // Call a method to register this client and get its number
  Meteor.call("addClient", (error, result) => {
    if (!error) {
      this.clientNumber.set(result)
      console.log("Assigned client number:", result)
    }
  })
})

Template.logger.helpers({
  screenNumber() {
    return Template.instance().clientNumber.get()
  },
  posX() {
    return Template.instance().pointer.get("X") - 10
  },
  posY() {
    return Template.instance().pointer.get("Y") - 20
  },
})

Template.logger.events({
  "mousemove .container"(event, instance) {
    // const timestamp = Date.now()
    // // 1000/60 = 16.66. 60FPS mammen!
    // if (timestamp < instance.oldTimeStamp + 10) {
    //   return
    // }
    // instance.oldTimeStamp = timestamp

    const coordX = event.clientX
    const coordY = event.clientY

    instance.pointer.set("X", coordX)
    instance.pointer.set("Y", coordY)

    const message = { type: "move", pointer: instance.clientNumber.get(), coords: [coordX, coordY] }
    sendMessage(message)
  },
  "mousedown .container"(event, instance) {
    const coordX = event.clientX
    const coordY = event.clientY

    const message = { type: "mousedown", pointer: instance.clientNumber.get(), coords: [coordX, coordY] }

    sendMessage(message)
  },
})

function sendMessage(message) {
  streamer.emit("message", message) // Use the streamer or other method to send the message to the server
}
