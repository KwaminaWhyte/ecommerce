import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { Employee } from "./Employee";
import { commitSession, getSession } from "~/session";

export default class EmployeeController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  public getEmployees = async ({ page }: { page: number }) => {
    const limit = 10; // Number of orders per page
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const totalEmployeeCount = await Employee.countDocuments({}).exec();
    const totalPages = Math.ceil(totalEmployeeCount / limit);

    try {
      const employees = await Employee.find({})
        .skip(skipCount)
        .limit(limit)
        .exec();

      return { employees, totalPages };
    } catch (error) {
      console.error("Error retrieving employees:", error);
    }
  };

  /**
   * create an employee
   * @param param0 firstNmae
   *
   * @returns
   */
  public createEmployee = async ({
    firstName,
    lastName,
    email,
    username,
    password,
    role,
    gender,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    gender: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const existingEmployee = await Employee.findOne({ username });

    if (existingEmployee) {
      return json(
        {
          errors: { name: "Employee already exists" },
          fields: { firstName, lastName, username, email },
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role,
      gender,
    });

    if (!employee) {
      session.flash("message", {
        title: "Error creating employee",
        status: "error",
      });
      return redirect(`/console/employees`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Employee created successfully",
      status: "success",
    });
    return redirect(`/console/employees`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  /**
   * get a single employee
   * @param param0
   * @returns
   */
  public getEmployee = async (id: string) => {
    try {
      const employee = await Employee.findById(id);
      return employee;
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Update employee
   * @param param0
   */
  public updateEmployee = async ({
    firstName,
    lastName,
    email,
    username,
    role,
    gender,
    _id,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    gender: string;
    _id: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    await Employee.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      email,
      username,
      role,
      gender,
    });

    session.flash("message", {
      title: "Employee deleted successfully",
      status: "success",
    });
    return redirect(`/console/employees`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  public deleteEmployee = async (id: string) => {
    try {
      await Employee.findByIdAndDelete(id);
      return json(
        { message: "Employee deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      console.log(err);
    }
  };

  public getSalesPerson = async () => {
    try {
      const employees = await Employee.find({
        role: "sales person",
      }).exec();

      return employees;
    } catch (error) {
      console.error("Error retrieving employees:", error);
    }
  };
}
