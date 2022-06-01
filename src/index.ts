import express from "express";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

dotenv.config();

const app = express();

Sentry.init({
  dsn: "https://346336578b3c474dbe9256ff29b1ab2a@o1202411.ingest.sentry.io/6460956",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  debug: true,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Started on ${PORT} port`);
});