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

  instance = this

  // Reactive variable to hold the assigned client number
  this.clientNumber = new ReactiveVar(null)

  // Call a method to register this client and get its number
  Meteor.call("addClient", (error, result) => {
    if (!error) {
      this.clientNumber.set(result)
      console.log("Assigned client number:", result)
    }
  })

  document.addEventListener("mousemove", function(event) {
    let coords = {
      x: event.movementX,
      y: event.movementY
    }

    let newPointerPosition = {
      x: instance.pointer.get("X") + coords.x,
      y: instance.pointer.get("Y") + coords.y
    }

    //Clamp newPointerPosition between 0,0 and containerDimensions
    let containerDimensions = {x:document.querySelector(".container").clientWidth, y:document.querySelector(".container").clientHeight};
    if(newPointerPosition.x < 0) newPointerPosition.x = 0;
    if(newPointerPosition.y < 0) newPointerPosition.y = 0;
    if(newPointerPosition.x > containerDimensions.x) newPointerPosition.x = containerDimensions.x;
    if(newPointerPosition.y > containerDimensions.y) newPointerPosition.y = containerDimensions.y;

    instance.pointer.set("X", newPointerPosition.x)
    instance.pointer.set("Y", newPointerPosition.y)

    sendMessage({ type: "move", pointer: instance.clientNumber.get(), coords: coords })
  })
})

Template.logger.onRendered(function() {
  console.log("logger rendered")
  document.querySelector("body").addEventListener("click", function() {
    document.querySelector("body").requestPointerLock();
  }, {once:true})
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
  "mousedown .container"(event, instance) {
    const coordX = event.clientX
    const coordY = event.clientY

    const message = { type: "mousedown", pointer: instance.clientNumber.get(), coords: [coordX, coordY] }

    sendMessage(message)
  },
  "mouseup .container"(event, instance) {
    const coordX = event.clientX
    const coordY = event.clientY

    const message = { type: "mouseup", pointer: instance.clientNumber.get(), coords: [coordX, coordY] }

    sendMessage(message)
  },
})

function sendMessage(message) {
  streamer.emit("message", message) // Use the streamer or other method to send the message to the server
}
