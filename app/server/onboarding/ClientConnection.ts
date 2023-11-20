import { mongoose } from "../mongoose.server";

const ClientConnectionSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },

    storeName: String,
    email: String,
    phone: String,

    domain: {
      type: String,
      unique: true,
    },
    databaseUri: String,
    businessName: String,
    dbName: String,
    dbPassword: String,
  },
  { timestamps: true }
);

export { ClientConnectionSchema };