import express from "express";
import dotenv from "dotenv";
import connect from "./clients/mongoose";
import middleware from "./middleware";
import routes from "./routes";
import FileClient from "./clients/file";
import assert from "assert";
import EmailClient from "./clients/email";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const {
  FILE_API_ENDPOINT,
  FILE_API_AUTH_ENDPOINT,
  FILE_API_USERNAME,
  FILE_API_PASSWORD,
} = process.env;

const {
  EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD,
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT,
} = process.env;

assert(Boolean(FILE_API_ENDPOINT), new Error("FILE_API_ENDPOINT not defined"));
assert(
  Boolean(FILE_API_AUTH_ENDPOINT),
  new Error("FILE_API_AUTH_ENDPOINT not defined")
);
assert(Boolean(FILE_API_USERNAME), new Error("FILE_API_USERNAME not defined"));
assert(Boolean(FILE_API_PASSWORD), new Error("FILE_API_PASSWORD not defined"));

const fileClient = FileClient.getInstance<FileClient>();
fileClient.configure(
  FILE_API_ENDPOINT as string,
  FILE_API_AUTH_ENDPOINT as string
);

const emailClient = EmailClient.getInstance();
emailClient.configure({
  host: EMAIL_SERVER_HOST,
  port: Number(EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: EMAIL_SERVER_USER,
    pass: EMAIL_SERVER_PASSWORD,
  },
});

connect(async (_mongoose) => {
  try {
    await fileClient.authenticate(
      FILE_API_USERNAME as string,
      FILE_API_PASSWORD as string
    );

    middleware(app);
    routes(app);
    app.get("/test", (_req, res) => {
      return res.status(200).send("OK");
    });

    app.listen(port, () => {
      console.log(`Student Portal Server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
});
