const { onRequest } = require("firebase-functions/v2/https");
const handler = require("./server").handler;

exports.nextServer = onRequest(
  {
    region: "us-central1",
    memory: "2GiB",
    cpu: 1,
    minInstances: 0,
    maxInstances: 20,
    concurrency: 20,
    timeoutSeconds: 60,
    invoker: "public",
  },
  (req, res) => {
    return handler(req, res);
  }
);