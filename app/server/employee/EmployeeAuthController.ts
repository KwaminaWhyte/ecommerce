import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "../mongoose.server";

export default class EmployeeAuthController {
  private request: Request;
  private domain: string;
  private session: any;
  private Employee: any;
  private storage: SessionStorage;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });

    return (async (): Promise<EmployeeAuthController> => {
      await this.initializeModels();
      return this;
    })() as unknown as EmployeeAuthController;
  }

  private async initializeModels() {
    const { Employee } = await connectToDomainDatabase();
    this.Employee = Employee;
  }

  private async createEmployeeSession(employeeId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("employeeId", employeeId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getEmployeeSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  public async loginEmployee({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const employee = await this.Employee.findOne({ email });

    if (!employee) {
      return json(
        { message: "No account associated with this Email", type: "error" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, employee.password);

    if (!valid) {
      return json(
        {
          message: "Invalid Credentials",
          type: "error",
          fields: { email, password },
        },
        { status: 400 }
      );
    }

    return this.createEmployeeSession(employee._id, "/pos");
  }

  public async logout() {
    const session = await this.getEmployeeSession();

    return redirect("/pos/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public async requireEmployeeId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getEmployeeSession();

    const employeeId = session.get("employeeId");
    if (!employeeId || typeof employeeId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/pos/login?${searchParams}`);
    }

    return employeeId;
  }

  public async getEmployeeId() {
    const session = await this.getEmployeeSession();
    const employeeId = session.get("employeeId");
    if (!employeeId || typeof employeeId !== "string") {
      return null;
    }

    return employeeId;
  }

  public async getEmployee() {
    const employeeId = await this.getEmployeeId();
    if (typeof employeeId !== "string") {
      return null;
    }

    try {
      const employee =
        await this.Employee.findById(employeeId).select("-password");
      return employee;
    } catch {
      throw this.logout();
    }
  }
}

// export const signup = async (
//   username: string,
//   email: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const clientDb = await connectToDomainDatabase(domain);
//   const Employee = clientDb.model("employees", EmployeeSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const employee = await Employee.create({
//     username,
//     email,
//     password: hashedPassword,
//   });

//   if (!employee) {
//     return json(
//       { error: "Error creating employee", fields: { username, email } },
//       { status: 400 }
//     );
//   }

//   return createEmployeeSession(employee.id, "/pos");
// };

// export const changePassword = async (
//   employeeId: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const clientDb = await connectToDomainDatabase(domain);
//   const Employee = clientDb.model("employees", EmployeeSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);

//   let employee = await Employee.updateOne(
//     { _id: employeeId },
//     { password: hashedPassword },
//     { new: true }
//   );

//   return employee;
// };

// export const requirePermission = async ({
//   request,
//   action,
// }: {
//   request: Request;
//   action: string;
// }) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];
//   const clientDb = await connectToDomainDatabase(domain);
//   const Employee = clientDb.model("employees", EmployeeSchema);

//   const employeeId = await requireEmployeeId(request);

//   if (typeof employeeId !== "string") {
//     return null;
//   }

//   try {
//     const employee: EmployeeInterface = await Employee.findById(employeeId).select(
//       "id email username role permissions"
//     );

//     // filter permissions to check if there is any match for the action
//     const hasPermission = employee.permissions.filter((permission) => {
//       return permission.action === action;
//     });

//     if (hasPermission.length === 0) {
//       return json(
//         {
//           message: `Unauthorized: You can not perform ${action}`,
//           type: "error",
//         },
//         { status: 401 }
//       );
//     }

//     return employee;
//   } catch {
//     throw logout(request);
//   }
// };