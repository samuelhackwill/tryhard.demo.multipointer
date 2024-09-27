import { Meteor } from "meteor/meteor"
import { Mongo } from "meteor/mongo"
import { streamer } from "../both/streamer.js"

// Create a new collection to track connected clients
export const Clients = new Mongo.Collection("clients")

const description = "Test de performance de la connection DDP. On teste d'utiliser la réactivité meteor out of the box pour voir si c'est crédible avec x pointeurs de souris en temps réél."

WebApp.connectHandlers.use("/api/hello", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow all origins (use specific domains for more security)
  res.setHeader("Content-Type", "text/plain")

  res.write(description)
  res.end()
})

streamer.allowRead("all")
streamer.allowWrite("all")

streamer.on("message", function (message) {
  // console.log("getting update : ", message)
})
Meteor.publish("clients", function () {
  return Clients.find()
})

Meteor.methods({
  // Method to add a new client with its connectionId and get the assigned number
  addClient() {
    const connectionId = this.connection.id // Get the unique connection id
    const clientCount = Clients.find().count()
    const newClientNumber = clientCount + 1

    // Insert a new client with connectionId and client number
    Clients.insert({ connectionId, number: newClientNumber, status: "connected" })

    // Return the assigned client number to the client
    return newClientNumber
  },
})

Meteor.startup(async () => {
  console.log("nuking all clients ")
  Clients.remove({})
})

// Automatically handle cleanup when a client disconnects
Meteor.onConnection((connection) => {
  const connectionId = connection.id

  // Attach a handler to run when this client disconnects
  connection.onClose(() => {
    // Remove the client entry from the collection based on its connectionId
    Clients.remove({ connectionId })
    console.log(`Client with connectionId ${connectionId} disconnected and removed.`)
    console.log("remaining clients ", Clients.find({}).fetch())
  })
})
