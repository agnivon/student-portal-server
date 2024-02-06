import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export function comparePassword(
  userPassword: string,
  candidatePassword: string
): Promise<boolean> {
  try {
    return bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    throw error;
  }
}
