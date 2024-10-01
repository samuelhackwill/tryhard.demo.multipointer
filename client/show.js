import { Template } from "meteor/templating"
import { ReactiveDict } from "meteor/reactive-dict"
import { streamer } from "../both/streamer.js"
import { FlowRouter } from "meteor/ostrio:flow-router-extra"

import "./show.html"

let Lastelement = null
let animationFrame

Template.show.onCreated(function () {
  // Initialize the reactive dictionary to keep track of each client's pointer position.
  this.pointers = new ReactiveDict()

  // fuuuuu
  instance = this
})

Template.show.onRendered(function () {
  streamer.emit("showInit", {"width":window.innerWidth, "height":window.innerHeight})
})

streamer.on("displayMessage", function (message) {
  // Ensure the code only runs on the 'show' route to avoid unwanted executions.
  if (FlowRouter.getRouteName() === "show") {
    //message.pointers contains all the pointers that have changed state this frame (moved, etc)
    // => reflect this change on the reactive dictionary
    message.pointers.forEach(p => {
      instance.pointers.set(p.id, p);
    })
  }
})

Template.show.helpers({
  // Get all client pointers for iteration if you want to display all.
  allPointers() {
    const pointers = Object.values(instance.pointers.all());
    return pointers;
  },
})

Template.show.events({
  "click button"() {
    // console.log("yahouuuu")
  },
})

simulateMouseUp = function (message) {
  pointer = document.getElementById("pointer" + message.pointer)
  pointer.classList.remove("border-solid", "border-2")

  const [x, y] = message.coords
  const element = document.elementFromPoint(x, y)

  if (element.tagName == "BUTTON") {
    // Visual feedback for debugging
    // element.style.outline = "2px solid red" // Highlight the element
    element.click()
    element.classList.remove("border-solid", "border-2", "border-indigo-800")
  } else {
    return
    // console.warn("No element found at coordinates:", [x, y])
  }
}

simulateMouseDown = function (message) {
  // console.log("click!", Number(message.coords[0]), Number(message.coords[1]))
  // rond = [message.coords[0], message.coords[1]]
  // document.elementFromPoint(Number(message.coords[0]), Number(message.coords[1])).click()

  // document.elementFromPoint(109, 60).click()
  pointer = document.getElementById("pointer" + message.pointer)
  pointer.classList.add("border-solid", "border-2", "border-indigo-800")

  const [x, y] = message.coords
  const element = document.elementFromPoint(x, y)
  // console.log("Element at coordinates:", element)
  console.log(message.pointer, " clicked on button")

  if (element.tagName == "BUTTON") {
    // Visual feedback for debugging
    // element.style.outline = "2px solid red" // Highlight the element
    element.click()
    element.classList.add("border-solid", "border-2", "border-indigo-800")
  } else {
    return
    // console.warn("No element found at coordinates:", [x, y])
  }
}

simulateMouseEnter = function (message) {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  animationFrame = requestAnimationFrame(() => {
    const [x, y] = message.coords
    const element = document.elementFromPoint(x, y)

    if (element !== Lastelement && element?.tagName === "BUTTON") {
      // Remove the class from the last element if it was set
      Lastelement?.classList.remove("!bg-red-600")
      pointer = document.getElementById("pointer" + message.pointer)
      pointer.classList.add("!bg-pointer")
      // Update the class of the new element
      element.classList.add("!bg-red-600")
      Lastelement = element
    } else if (!element || element.tagName !== "BUTTON") {
      Lastelement?.classList.remove("!bg-red-600")
      Lastelement = null
      pointer = document.getElementById("pointer" + message.pointer)
      pointer.classList.remove("!bg-pointer")
    }
  })
}
