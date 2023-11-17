import { mongoose } from "../mongoose.server";

const EmployeePermissionsSchema = new mongoose.Schema({
  name: String,
  action: String,
});

const EmployeeSchema = new mongoose.Schema(
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
    role: String,
    gender: String,
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
    status: String,
  },
  { timestamps: true }
);

// let Employees: mongoose.Model<any>;
// let EmployeePermissions: mongoose.Model<any>;
// try {
//   Employees = mongoose.model("employees");
//   EmployeePermissions = mongoose.model("employee_permissions");
// } catch (error) {
//   Employees = mongoose.model("employees", EmployeesSchema);
//   EmployeePermissions = mongoose.model(
//     "employee_permissions",
//     EmployeePermissionsSchema
//   );
// }

export { EmployeePermissionsSchema, EmployeeSchema };
