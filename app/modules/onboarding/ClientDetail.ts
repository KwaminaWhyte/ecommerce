import { mongoose } from "../mongoose.server";

const ClientDetailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    username: String,
    phone: String,
    password: String,
  },
  { timestamps: true }
);

export { ClientDetailSchema };
