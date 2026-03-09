const next = require("next");
const path = require("path");

process.env.NODE_ENV = "production";

const nextApp = next({
  dev: false,
  conf: {
    distDir: path.join(__dirname, ".next"),
  },
});

const handle = nextApp.getRequestHandler();
let preparePromise;

function ensurePrepared() {
  if (!preparePromise) {
    preparePromise = nextApp.prepare();
  }
  return preparePromise;
}

exports.handler = async (req, res) => {
  const startedAt = Date.now();
  const url = req.originalUrl || req.url;
  const method = req.method;
  const contentType = req.headers["content-type"];
  const contentLength = req.headers["content-length"];

  res.on("finish", () => {
    if (method === "POST" && url.startsWith("/catalog")) {
      console.info("nextServer request completed", {
        method,
        url,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
        contentType,
        contentLength,
      });
    }
  });

  const isCatalogPost = method === "POST" && url.startsWith("/catalog");
  const isJsonRequest =
    typeof contentType === "string" && contentType.includes("application/json");
  const isEmptyBody = contentLength === "0";

  if (isCatalogPost && isJsonRequest && isEmptyBody) {
    console.warn("nextServer rejected empty JSON payload", {
      method,
      url,
      contentType,
      contentLength,
    });
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  try {
    await ensurePrepared();
    return handle(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const isMalformedJson = /Unexpected end of JSON input/i.test(message);

    console.error("nextServer request failed", {
      method,
      url,
      contentType,
      contentLength,
      isMalformedJson,
      message,
      stack,
    });

    if (res.headersSent) {
      return;
    }

    if (isMalformedJson) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }

    return res.status(500).send("Internal Server Error");
  }
};
