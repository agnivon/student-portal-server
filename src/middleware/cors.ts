import cors from "cors";
import { Express } from "express";

export default function corsMiddleware(app: Express) {
  app.use(
    cors({
      origin: process.env.CLIENT_HOST,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "X-HTTP-Method-Override",
        "Set-Cookie",
        "Cookie",
      ],
    })
  );
  app.set("trust proxy", 1);
}
