import { z } from "zod";

const firstNameSchema = z.string().max(64);
const lastNameSchema = z.string().max(64);
const usernameSchema = z
  .string()
  .max(64)
  .optional()
  .nullable()
  .transform((val) => val || null);
const phoneSchema = z
  .string()
  .max(15)
  .optional()
  .nullable()
  .transform((val) => val || null);
const passwordSchema = z.string().min(10).max(100);

export const CreateUserBodySchema = z
  .object({
    first_name: firstNameSchema,
    last_name: lastNameSchema,
    email: z.string().email(),
  })
  .required({
    first_name: true,
    last_name: true,
    email: true,
  });

export const RegisterUserBodySchema = z
  .object({
    registration_id: z.string().min(1),
    first_name: firstNameSchema,
    last_name: lastNameSchema,
    username: usernameSchema,
    password: passwordSchema,
    phone: phoneSchema,
  })
  .required({
    first_name: true,
    last_name: true,
    registration_id: true,
    password: true,
  });

export const UpdateUserProfileBodySchema = z.object({
  first_name: firstNameSchema.optional(),
  last_name: lastNameSchema.optional(),
  username: usernameSchema,
  phone: phoneSchema,
});

export const ChangePasswordBodySchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordSchema,
  })
  .required({
    oldPassword: true,
    newPassword: true,
  });

export const ResetPasswordBodySchema = z
  .object({
    password: passwordSchema,
    confirm: passwordSchema,
    user_id: z.string(),
  })
  .required({
    password: true,
    confirm: true,
    user_id: true,
  });

export const NewPostBodySchema = z
  .object({
    title: z.string().max(150),
    content: z.string().max(3000),
    attachments: z
      .array(z.string())
      .max(5, "Max 5 attachments allowed")
      .default([]),
  })
  .required({
    title: true,
    content: true,
  });

export const ChangeUserStatusBodySchema = z
  .object({
    user_id: z.string(),
    is_active: z.boolean(),
  })
  .required({
    user_id: true,
    is_active: true,
  });

export const ApplyLeaveBodySchema = z
  .object({
    reason: z
      .string()
      .max(150)
      .nullish()
      .transform((val) => val || null),
    from_date: z.coerce.date().refine((val) => val > new Date(), {
      message: "Date cannot be today and before today",
    }),
    to_date: z.coerce.date(),
  })
  .required({
    from_date: true,
    to_date: true,
  })
  .refine((data) => data.from_date <= data.to_date, {
    message: "To date must be greater than or equal to from date",
  });

export const LeaveApprovalBodySchema = z
  .object({
    approved: z.boolean(),
  })
  .required({
    approved: true,
  });

export const SendVerificationCodeBodySchema = z
  .object({
    email: z.string().email(),
  })
  .required({
    email: true,
  });

export const ForgotPasswordBodySchema = z.object({
  email: z.string().email(),
  verification_code: z.string(),
  password: passwordSchema,
});
