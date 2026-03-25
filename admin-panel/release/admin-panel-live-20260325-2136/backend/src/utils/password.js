import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
