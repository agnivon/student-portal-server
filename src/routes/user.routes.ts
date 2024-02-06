import { AxiosError } from "axios";
import express from "express";
import multer from "multer";
import { ZodError } from "zod";
import EmailClient from "../clients/email";
import FileClient from "../clients/file";
import multerConfig from "../config/multer";
import RegistrationEmail from "../emails/register";
import { File, User, Verification } from "../models/mongoose";
import {
  ChangePasswordBodySchema,
  ChangeUserStatusBodySchema,
  CreateUserBodySchema,
  ForgotPasswordBodySchema,
  RegisterUserBodySchema,
  SendVerificationCodeBodySchema,
  UpdateUserProfileBodySchema,
} from "../schema/validation/request_body";
import { hashPassword } from "../utils/crypto.utils";
import { removeFields } from "../utils/object.utils";
import {
  ensureAdminAuthenticated,
  ensureAuthenticated,
} from "../utils/passport.utils";
import { getErrorMessage } from "../utils/zod.utils";
import VerificationEmail from "../emails/verification";

const EMAIL_FROM = process.env.EMAIL_FROM;

const upload = multer(multerConfig);

const userRouter = express.Router();
const emailClient = EmailClient.getInstance();
const fileClient = FileClient.getInstance();

userRouter.get("/", ensureAuthenticated, (req, res) => {
  if (!req.user) return res.status(401).send("Unauthorized");
  return res.status(200).json(removeFields(req.user, ["password"]));
});

userRouter.get("/my-students", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const users = await User.find({ admin_id: req.user._id })
      .select({ password: 0 })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(users);
  } catch (err) {
    console.log(err);

    return res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/create", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const { email, ...rest } = CreateUserBodySchema.parse(req.body);

    const newUser = await User.create({
      email,
      ...rest,
      admin_id: req.user._id,
    });
    emailClient.sendMail(
      RegistrationEmail({ registrationCode: newUser._id.toString() }),
      { to: email, from: EMAIL_FROM, subject: "Register on Student Portal" }
    );
    return res.json(newUser);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const { registration_id, password, ...formData } =
      RegisterUserBodySchema.parse(req.body);

    const updatedUser = await User.findByIdAndUpdate(
      registration_id,
      { ...formData, password: await hashPassword(password), is_active: true },
      {
        returnDocument: "after",
        select: {
          password: false,
        },
      }
    ).lean();
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.put("/profile", ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const formData = UpdateUserProfileBodySchema.parse(req.body);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, formData, {
      returnDocument: "after",
      select: {
        password: false,
      },
    }).lean();
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.put(
  "/change-profile-image",
  ensureAuthenticated,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).send("Unauthorized");
      if (req.file) {
        //console.log(req.file, req.file.buffer);
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        const uploadId = await fileClient.upload(blob);
        await File.create({
          _id: uploadId,
          name: req.file.originalname,
          mimetype: req.file.mimetype,
        });
        const user = await User.findByIdAndUpdate(
          req.user._id,
          {
            profile_image: uploadId,
          },
          { returnDocument: "after" }
        );

        return res.json(user);
      } else {
        return res.status(400).send("Image not provided");
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
      }
      return res.status(500).send("Internal Server Error");
    }
  }
);

userRouter.put("/change-status", ensureAdminAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const formData = ChangeUserStatusBodySchema.parse(req.body);

    const updatedUser = await User.findOneAndUpdate(
      { _id: formData.user_id, admin_id: req.user._id },
      { is_active: formData.is_active },
      {
        returnDocument: "after",
        select: {
          password: false,
        },
      }
    ).lean();
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/change-password", ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Unauthorized");
    const formData = ChangePasswordBodySchema.parse(req.body);

    const currentUser = await User.findById(req.user._id);

    if (currentUser) {
      if (await currentUser.comparePassword(formData.oldPassword)) {
        currentUser.password = formData.newPassword;
        await currentUser.save();
        return res.status(204).send();
      } else {
        return res.status(401).send("Invalid password");
      }
    } else {
      return res.status(401).send("User not found");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/send-verification-code", async (req, res) => {
  try {
    const { email } = SendVerificationCodeBodySchema.parse(req.body);

    const user = await User.findOne({ email, is_active: true }).lean();

    if (user) {
      const verification = await Verification.create({ user_id: user._id });
      emailClient.sendMail(
        VerificationEmail({ verificationCode: verification._id.toString() }),
        {
          to: email,
          from: EMAIL_FROM,
          subject: "Student Portal Verification Code",
        }
      );
      return res.status(204).send();
    } else {
      return res.status(400).send("User not found");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email, verification_code, password } =
      ForgotPasswordBodySchema.parse(req.body);

    const user = await User.findOne({ email, is_active: true });

    if (!user) return res.status(400).send("User not found");

    const verification = await Verification.findOne({
      _id: verification_code,
      active: true,
      expiryAt: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    console.log(!verification, verification?.user_id.equals(user._id));
    console.log(verification?.user_id, user._id);

    if (!verification || !verification.user_id.equals(user._id)) {
      if (verification) {
        verification.active = false;
        await verification.save();
      }
      return res.status(400).send("Verification code invalid");
    }
    verification.active = false;
    user.password = password;

    await verification.save();
    await user.save();

    return res.status(204).send();
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return res.status(400).send(getErrorMessage(err));
    }
    return res.status(500).send("Internal Server Error");
  }
});

export default userRouter;
