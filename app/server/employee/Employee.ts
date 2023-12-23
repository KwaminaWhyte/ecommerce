import mongoose from "../mongoose.server";
import { EmployeeInterface } from "../types";

const EmployeePermissionsSchema = new mongoose.Schema({
  name: String,
  action: String,
});

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    username: String,
    password: String,
    role: {
      type: String,
      enum: ["sales person", "cashier"],
      default: "sales person",
    },
    gender: String,
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permissions",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

let Employee: mongoose.Model<EmployeeInterface>;
let EmployeePermissions: mongoose.Model<any>;
try {
  Employee = mongoose.model<EmployeeInterface>("employees");
  EmployeePermissions = mongoose.model("employee_permissions");
} catch (error) {
  Employee = mongoose.model<EmployeeInterface>("employees", EmployeeSchema);
  EmployeePermissions = mongoose.model(
    "employee_permissions",
    EmployeePermissionsSchema
  );
}

export { Employee, EmployeePermissions };
