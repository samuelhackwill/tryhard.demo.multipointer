import "./logger.html"

oldTimeStamp = 0

Template.logger.onCreated(function () {
  // console.log(this.data.number)
})

Template.logger.helpers({
  screenNumber() {
    return this.number
  },
})

Template.logger.events({
  "mousemove .container"(event) {
    // check if it has fired in the past 500ms

    if (event.timeStamp < oldTimeStamp + 250) {
      console.log("THROTTLED!")
      return
    } else {
      oldTimeStamp = event.timeStamp
      console.log("movin, timestamp = ", event.timeStamp)
      console.log("movin, X = ", event.originalEvent.clientX, "; Y = ", event.originalEvent.clientY)
      message = { pointer: Number(this.number), coords: [event.originalEvent.clientX, event.originalEvent.clientY] }
      sendMessage(message)
    }
  },
})
