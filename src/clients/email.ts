import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import Singleton from "../lib/classes/Singleton";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export default class EmailClient extends Singleton {
  static instance: EmailClient | null = null;
  private transporter: ReturnType<typeof nodemailer.createTransport> | null =
    null;

  public configure(transport?: string | SMTPTransport | SMTPTransport.Options) {
    this.transporter = nodemailer.createTransport(transport);
  }

  public async sendMail(email: React.ReactElement, options: MailOptions) {
    const emailHtml = render(email);

    await this.transporter?.sendMail({ html: emailHtml, ...options });
  }
}
