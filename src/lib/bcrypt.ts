import Bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hash = async (password: string) => {
  return await Bcrypt.hash(password, SALT_ROUNDS);
};

export const compare = async (password: string, hash: string) => {
  return await Bcrypt.compare(password, hash);
};
