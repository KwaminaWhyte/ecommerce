import { mongoose } from "../mongoose.server";

const PermissionSchema = new mongoose.Schema({
  name: String,
  action: String,
});

const AdminSchema = new mongoose.Schema(
  {
    firstName: String,
    middleName: String,
    lastName: String,
    email: { type: String, unique: true },
    username: String,
    password: String,
    role: String,
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permissions",
      },
    ],
    clientConnection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientConnections",
    },
  },
  { timestamps: true }
);

// let Admins: mongoose.Model<any>;
// let Permissions: mongoose.Model<any>;
// try {
//   Admins = mongoose.model("admins");
//   Permissions = mongoose.model("permissions");
// } catch (error) {
//   Admins = mongoose.model("admins", AdminsSchema);
//   Permissions = mongoose.model("permissions", PermissionsSchema);
// }

export { PermissionSchema, AdminSchema };
