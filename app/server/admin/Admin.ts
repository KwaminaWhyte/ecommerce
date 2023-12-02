import mongoose from "../mongoose.server";
import type { AdminInterface } from "../types";

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
  },
  { timestamps: true }
);

let Admin: mongoose.Model<AdminInterface>;
let Permissions: mongoose.Model<AdminInterface>;
try {
  Admin = mongoose.model<AdminInterface>("admins");
  Permissions = mongoose.model<any>("permissions");
} catch (error) {
  Admin = mongoose.model<AdminInterface>("admins", AdminSchema);
  Permissions = mongoose.model<any>("permissions", PermissionSchema);
}

export { PermissionSchema, AdminSchema, Permissions, Admin };
