import "./logger.html"
import { ReactiveDict } from "meteor/reactive-dict"

oldTimeStamp = 0

Template.logger.onCreated(function () {
  // console.log(this.data.number)
  pointer = new ReactiveDict()
  pointer.set("X", 1)
  pointer.set("Y", 1)
})

Template.logger.helpers({
  screenNumber() {
    return this.number
  },
  posX() {
    return pointer.get("X")
  },
  posY() {
    return pointer.get("Y")
  },
})

Template.logger.events({
  "mousemove .container"(event) {
    // check if it has fired in the past 500ms

    if (event.timeStamp < oldTimeStamp + 10) {
      console.log("THROTTLED!")
      return
    } else {
      oldTimeStamp = event.timeStamp
      console.log("movin, timestamp = ", event.timeStamp)
      console.log("movin, X = ", event.originalEvent.clientX, "; Y = ", event.originalEvent.clientY)

      coordX = event.originalEvent.clientX
      coordY = event.originalEvent.clientY

      pointer.set("X", coordX)
      pointer.set("Y", coordY)

      message = { pointer: Number(this.number), coords: [coordX, coordY] }
      sendMessage(message)
    }
  },
})
