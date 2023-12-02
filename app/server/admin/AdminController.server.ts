import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { Admin } from "./Admin";

export default class AdminController {
  private request: Request;
  private storage: SessionStorage;

  /**
   * Initialize a AdminController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;

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
  }

  private async createAdminSession(adminId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("adminId", adminId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getAdminSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  /**
   * Get the current logged in user's Id
   * @returns admin_id :string
   */
  public async getAdminId() {
    const session = await this.getAdminSession();
    const adminId = session.get("adminId");
    if (!adminId || typeof adminId !== "string") {
      return null;
    }
    return adminId;
  }

  public async getAdmin() {
    const adminId = await this.getAdminId();
    if (typeof adminId !== "string") {
      return null;
    }

    try {
      const admin = await Admin.findById(adminId).select("-password");
      return admin;
    } catch {
      throw this.logout();
    }
  }

  public async loginAdmin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return json(
        { message: "No account associated with this Email", type: "error" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);

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

    return this.createAdminSession(admin._id, "/console");
  }

  public async logout() {
    const session = await this.getAdminSession();

    return redirect("/console/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public async requireAdminId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getAdminSession();

    const adminId = session.get("adminId");
    if (!adminId || typeof adminId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/console/login?${searchParams}`);
    }

    return adminId;
  }
}

// export const changePassword = async (
//   adminId: string,
//   password: string,
//   request: Request
// ) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];

//   const Admin = clientDb.model("admins", AdminSchema);

//   const hashedPassword = await bcrypt.hash(password, 10);

//   let admin = await Admin.updateOne(
//     { _id: adminId },
//     { password: hashedPassword },
//     { new: true }
//   );

//   return admin;
// };

// export const requirePermission = async ({
//   request,
//   action,
// }: {
//   request: Request;
//   action: string;
// }) => {
//   let domain = (request.headers.get("host") as string).split(":")[0];
//   const Admin = clientDb.model("admins", AdminSchema);

//   const adminId = await requireAdminId(request);

//   if (typeof adminId !== "string") {
//     return null;
//   }

//   try {
//     const admin: AdminInterface = await Admin.findById(adminId).select(
//       "id email username role permissions"
//     );

//     // filter permissions to check if there is any match for the action
//     const hasPermission = admin.permissions.filter((permission) => {
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

//     return admin;
//   } catch {
//     throw logout(request);
//   }
// };
