import { Meteor } from "meteor/meteor"
import { Mongo } from "meteor/mongo"
import { streamer } from "../both/streamer.js"

// Create a new collection to track connected clients
export const Clients = new Mongo.Collection("clients")

const description = "Test de performance de la connection DDP. On teste d'utiliser la réactivité meteor out of the box pour voir si c'est crédible avec x pointeurs de souris en temps réél."
let eventQueue = [];
let pointers = [];

WebApp.connectHandlers.use("/api/hello", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // Allow all origins (use specific domains for more security)
  res.setHeader("Content-Type", "text/plain")

  res.write(description)
  res.end()
})

streamer.allowRead("all")
streamer.allowWrite("all")

streamer.on("pointerMessage", function (message) {
  if(message.type == "move") {
    eventQueue.push(message);
  }
})

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
  pointers = [];
  eventQueue = [];
 
  Meteor.setInterval(step, 1/60.0 * 1000);
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

function step() {
  //Process the event queue
  eventQueue.forEach(e => {
    let pointer = pointers.find(p => p.id == e.loggerId);
    
    //We don't know this pointer yet.
    //Welcome!
    if(pointer == undefined) {
      pointer = createPointer(e.loggerId);
    }
    
    //TODO: Rewrite this using a single vector-type param (eg pointer.move(e.coords))
    pointer.coords.x += e.coords.x;
    pointer.coords.y += e.coords.y;
    pointer.dirty = true;
  });
  eventQueue = [];


  let updateInstructions = {
    pointers: pointers.filter(p => p.dirty)
  }

  streamer.emit("displayMessage", updateInstructions);

  pointers = pointers.map(p => {p.dirty = false; return p;})
} 

function createPointer(id) {
  let newPointer = { id: id, coords:{x:50, y:50} };
  pointers.push(newPointer);
  return newPointer;
}
