import { mongoose } from "../mongoose.server";
import type { UserInterface } from "../types";

const UserSchema: mongoose.Schema<UserInterface> =
  new mongoose.Schema<UserInterface>(
    {
      firstName: String,
      middleName: String,
      lastName: String,
      email: {
        type: String,
        unique: true,
      },
      username: String,
      password: String,
      phone: String,
    },
    { timestamps: true }
  );

export { UserSchema };
