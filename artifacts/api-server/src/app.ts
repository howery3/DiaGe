import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import router from "./routes";
import privacyRouter from "./routes/privacy";
import supportRouter from "./routes/support";
import marketingRouter from "./routes/marketing";
import encryptionRouter from "./routes/encryption";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.use("/api", router);
app.use("/api", privacyRouter);
app.use("/api", supportRouter);
app.use("/api", marketingRouter);
app.use("/api", encryptionRouter);

export default app;
