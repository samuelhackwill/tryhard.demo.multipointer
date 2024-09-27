module.exports = {
  servers: {
    prot1: {
      host: "217.182.252.49",
      username: "samuel",
      opts: {
        port: 11142,
      },
    },
  },

  meteor: {
    // TODO: change app name and path
    name: "prot1",
    path: "../",

    servers: {
      prot1: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      PORT: 4001,
      ROOT_URL: "https://tryhard.samuel.ovh/prot1",
      MONGO_URL: "mongodb+srv://sam:0dhNSaK59dm2OGGn@samcluster-kpyns.mongodb.net/tryhardBelonne",
      // MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      image: "momenysr/meteor:root",
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },

  // mongo: {
  //   oplog: true,
  //   servers: {
  //     prot1: {}
  //   }
  // },
}
// TODO : change local mongo to hosted one

// pwd for atlas db : 0dhNSaK59dm2OGGn
// the cert.pem is in /Users/samuel/.mongodb/
