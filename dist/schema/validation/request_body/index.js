"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordBodySchema = exports.SendVerificationCodeBodySchema = exports.LeaveApprovalBodySchema = exports.ApplyLeaveBodySchema = exports.ChangeUserStatusBodySchema = exports.NewPostBodySchema = exports.ResetPasswordBodySchema = exports.ChangePasswordBodySchema = exports.UpdateUserProfileBodySchema = exports.RegisterUserBodySchema = exports.CreateUserBodySchema = void 0;
const zod_1 = require("zod");
const firstNameSchema = zod_1.z.string().max(64);
const lastNameSchema = zod_1.z.string().max(64);
const usernameSchema = zod_1.z
    .string()
    .max(64)
    .optional()
    .nullable()
    .transform((val) => val || null);
const phoneSchema = zod_1.z
    .string()
    .max(15)
    .optional()
    .nullable()
    .transform((val) => val || null);
const passwordSchema = zod_1.z.string().min(10).max(100);
exports.CreateUserBodySchema = zod_1.z
    .object({
    first_name: firstNameSchema,
    last_name: lastNameSchema,
    email: zod_1.z.string().email(),
})
    .required({
    first_name: true,
    last_name: true,
    email: true,
});
exports.RegisterUserBodySchema = zod_1.z
    .object({
    registration_id: zod_1.z.string().min(1),
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
exports.UpdateUserProfileBodySchema = zod_1.z.object({
    first_name: firstNameSchema.optional(),
    last_name: lastNameSchema.optional(),
    username: usernameSchema,
    phone: phoneSchema,
});
exports.ChangePasswordBodySchema = zod_1.z
    .object({
    oldPassword: zod_1.z.string(),
    newPassword: passwordSchema,
})
    .required({
    oldPassword: true,
    newPassword: true,
});
exports.ResetPasswordBodySchema = zod_1.z
    .object({
    password: passwordSchema,
    confirm: passwordSchema,
    user_id: zod_1.z.string(),
})
    .required({
    password: true,
    confirm: true,
    user_id: true,
});
exports.NewPostBodySchema = zod_1.z
    .object({
    title: zod_1.z.string().max(150),
    content: zod_1.z.string().max(3000),
    attachments: zod_1.z
        .array(zod_1.z.string())
        .max(5, "Max 5 attachments allowed")
        .default([]),
})
    .required({
    title: true,
    content: true,
});
exports.ChangeUserStatusBodySchema = zod_1.z
    .object({
    user_id: zod_1.z.string(),
    is_active: zod_1.z.boolean(),
})
    .required({
    user_id: true,
    is_active: true,
});
exports.ApplyLeaveBodySchema = zod_1.z
    .object({
    reason: zod_1.z
        .string()
        .max(150)
        .nullish()
        .transform((val) => val || null),
    from_date: zod_1.z.coerce.date().refine((val) => val > new Date(), {
        message: "Date cannot be today and before today",
    }),
    to_date: zod_1.z.coerce.date(),
})
    .required({
    from_date: true,
    to_date: true,
})
    .refine((data) => data.from_date <= data.to_date, {
    message: "To date must be greater than or equal to from date",
});
exports.LeaveApprovalBodySchema = zod_1.z
    .object({
    approved: zod_1.z.boolean(),
})
    .required({
    approved: true,
});
exports.SendVerificationCodeBodySchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
})
    .required({
    email: true,
});
exports.ForgotPasswordBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    verification_code: zod_1.z.string(),
    password: passwordSchema,
});
