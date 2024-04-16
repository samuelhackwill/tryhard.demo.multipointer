import { FlowRouter } from "meteor/ostrio:flow-router-extra"

import "./logger.js"
import "./show.js"

FlowRouter.route("/:number", {
  name: "logger",
  action(params) {
    this.render("logger", params)
  },
})

FlowRouter.route("/", {
  name: "show",
  action() {
    this.render("show")
  },
})
