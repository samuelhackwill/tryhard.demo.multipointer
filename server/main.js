import { Meteor } from "meteor/meteor"
import { streamer } from "../both/streamer.js"

streamer.allowRead("all")
streamer.allowWrite("all")

streamer.on("message", function (message) {
  // console.log("getting update : ", message)
})
