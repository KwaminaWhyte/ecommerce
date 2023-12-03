import mongoose from "../mongoose.server";
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

let User: mongoose.Model<UserInterface>;
try {
  User = mongoose.model<UserInterface>("users");
} catch (error) {
  User = mongoose.model<UserInterface>("users", UserSchema);
}

export { User };
