import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { EmployeesSchema } from "./models/Employee";
import { modelsConnector } from "./mongoose.server";
import { EmployeeInterface } from "./types";

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("No session secret provided");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [secret],
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const login = async ({
  email,
  password,
  request,
}: {
  email: string;
  password: string;
  request: Request;
}) => {
  let domain = (request.headers.get("host") as string).split(":")[0];
  const clientDb = await modelsConnector(domain);
  const Employees = clientDb.model("admins", EmployeesSchema);

  const employee = await Employees.findOne({
    where: {
      email,
    },
  });

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

  return createEmployeeSession(employee.id, "/pos");
};

export const changePassword = async ({
  adminId,
  password,
  request,
}: {
  adminId: string;
  password: string;
  request: Request;
}) => {
  let domain = (request.headers.get("host") as string).split(":")[0];
  const clientDb = await modelsConnector(domain);
  const Employees = clientDb.model("admins", EmployeesSchema);

  const hashedPassword = await bcrypt.hash(password, 10);

  let admin = await Employees.updateOne(
    { _id: adminId },
    { password: hashedPassword },
    { new: true }
  );

  return admin;
};

export const createEmployeeSession = async (
  adminId: string,
  redirectTo: string
) => {
  const session = await storage.getSession();
  session.set("adminId", adminId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export const getEmployeeSession = async (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

export const requireEmployeeId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const session = await getEmployeeSession(request);

  const adminId = session.get("adminId");
  if (!adminId || typeof adminId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/pos/login?${searchParams}`);
  }

  return adminId;
};

export const getEmployeeId = async (request: Request) => {
  const session = await getEmployeeSession(request);
  const adminId = session.get("adminId");
  if (!adminId || typeof adminId !== "string") {
    return null;
  }

  return adminId;
};

export const getEmployee = async (request: Request) => {
  let domain = (request.headers.get("host") as string).split(":")[0];
  const clientDb = await modelsConnector(domain);
  const Employees = clientDb.model("admins", EmployeesSchema);

  const adminId = await getEmployeeId(request);
  if (typeof adminId !== "string") {
    return null;
  }

  try {
    const admin = await Employees.findById(adminId).select("-password");
    return admin;
  } catch {
    throw logout(request);
  }
};

export const logout = async (request: Request) => {
  const session = await getEmployeeSession(request);

  return redirect("/pos/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
};

export const requirePermission = async (request: Request, action: string) => {
  let domain = (request.headers.get("host") as string).split(":")[0];
  const clientDb = await modelsConnector(domain);
  const Employees = clientDb.model("admins", EmployeesSchema);

  const adminId = await getEmployeeId(request);

  if (typeof adminId !== "string") {
    return null;
  }

  try {
    const admin: EmployeeInterface = await Employees.findById(adminId).select(
      "id email username role permissions"
    );

    // filter permissions to check if there is any match for the action
    const hasPermission = admin.permissions.filter((permission) => {
      return permission.action === action;
    });

    if (hasPermission.length === 0) {
      return json(
        {
          message: `Unauthorized: You can not perform ${action}`,
          type: "error",
        },
        { status: 401 }
      );
    }

    return admin;
  } catch {
    throw logout(request);
  }
};
