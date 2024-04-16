import { Template } from "meteor/templating"
import { ReactiveDict } from "meteor/reactive-dict"
import { streamer } from "../both/streamer.js"
import { FlowRouter } from "meteor/ostrio:flow-router-extra"

import "./show.html"

Template.show.onCreated(function () {
  pointers = new ReactiveDict()
  pointers.set(1, [1, 1])
  pointers.set(2, [1, 1])
})

streamer.on("message", function (message) {
  // only run if from show layout. Didn't find another way of doing it
  // as streamer seems to be a global object and runs everywhere.
  if (FlowRouter.getRouteName() == "show") {
    console.log(message.pointer, message.coords)
    pointers.set(message.pointer, message.coords)
  }
})

Template.show.helpers({
  posX(number) {
    // console.log("help ", pointers.get(number.hash.arg)[0])
    return pointers.get(number.hash.arg)[0]
  },
  posY(number) {
    return pointers.get(number.hash.arg)[1]
  },
})
