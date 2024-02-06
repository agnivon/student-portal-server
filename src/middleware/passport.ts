import { Express } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/mongoose";

export default function passportMiddleware(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ email: username }).lean();
        console.log(`User ${username} attempted to log in.`);
        if (!user) return done(null, false, { message: "Invalid email" });
        if (!user.is_active)
          return done(null, false, { message: "Inactive user" });
        if (!(await User.comparePassword(user.password || "", password))) {
          return done(null, false, {
            message: "Invalid password",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select({ password: 0 }).lean();
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
