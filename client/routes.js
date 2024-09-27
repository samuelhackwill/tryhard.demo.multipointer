import { FlowRouter } from "meteor/ostrio:flow-router-extra"
import "./logger.js"
import "./show.js"

FlowRouter.route("/", {
  name: "logger",
  action() {
    this.render("logger")
  },
})

FlowRouter.route("/show", {
  name: "show",
  action() {
    this.render("show")
  },
})
