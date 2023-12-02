import mongoose from "../mongoose.server";
const NotificationSchema = new mongoose.Schema(
  {
    api_key: {
      type: String,
      required: true,
    },
    api_token: {
      type: String,
      required: true,
    },
    api_endpoint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export { NotificationSchema };
