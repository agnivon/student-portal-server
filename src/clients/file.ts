import axios from "axios";
import dotenv from "dotenv";
import Singleton from "../lib/classes/Singleton";

dotenv.config();

// const FILE_API_ENDPOINT = process.env.FILE_API_ENDPOINT;
// const FILE_API_AUTH_ENDPOINT = process.env.FILE_API_AUTH_ENDPOINT;
// assert(Boolean(FILE_API_ENDPOINT), new Error("FILE_API_ENDPOINT not defined"));
// assert(
//   Boolean(FILE_API_AUTH_ENDPOINT),
//   new Error("FILE_API_AUTH_ENDPOINT not defined")
// );

export default class FileClient extends Singleton {
  static instance: FileClient | null = null;
  private authToken: string | null = null;
  private FILE_API_ENDPOINT: string = "";
  private FILE_API_AUTH_ENDPOINT: string = "";

  public configure(FILE_API_ENDPOINT: string, FILE_API_AUTH_ENDPOINT: string) {
    this.FILE_API_ENDPOINT = FILE_API_ENDPOINT;
    this.FILE_API_AUTH_ENDPOINT = FILE_API_AUTH_ENDPOINT;
  }

  public async authenticate(username: string, password: string) {
    const { token } = await axios
      .post<{ token: string }>(this.FILE_API_AUTH_ENDPOINT as string, {
        email: username,
        password,
      })
      .then((res) => res.data);
    this.authToken = token;
    return this.authToken;
  }

  public async upload(file: Blob) {
    const formData = new FormData();
    formData.set("picture", file);

    const { uploadId } = await axios
      .post<{ uploadId: string }>(
        `${this.FILE_API_ENDPOINT as string}/uploadfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      )
      .then((res) => res.data);

    return uploadId;
  }

  public async getFile(id: string) {
    const file = await axios
      .get<ArrayBuffer>(
        `${this.FILE_API_ENDPOINT as string}/${id}`,

        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            //"Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => res.data);

    return file;
  }
}
