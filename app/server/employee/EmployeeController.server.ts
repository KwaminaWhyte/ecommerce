import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { Employee } from "./Employee";

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
    middleName,
    lastName,
    email,
    username,
    password,
    role,
    gender,
  }: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: string;
    gender: string;
  }) => {
    const existingEmployee = await Employee.findOne({ username });

    if (existingEmployee) {
      return json(
        {
          errors: { name: "Employee already exists" },
          fields: { firstName, lastName, middleName, username, email },
        },
        { status: 400 }
      );
    }

    // const myString = imgSrc;
    // const myArray = myString.split("|");
    // let image = await EmployeeImages.create({
    //   url: myArray[0],
    //   imageId: myArray[1],
    // });

    // create new admin
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      firstName,
      middleName,
      lastName,
      email,
      username,
      password: hashedPassword,
      role,
      gender,
    });

    if (!employee) {
      return json(
        {
          error: "Error creating employee",
          fields: { firstName, lastName, middleName, username, email },
        },
        { status: 400 }
      );
    }
    return redirect("/console/employees");
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
    middleName,
    lastName,
    email,
    username,
    role,
    gender,
    _id,
  }: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    gender: string;
    _id: string;
  }) => {
    // try {
    await Employee.findOneAndUpdate(
      { _id },
      {
        firstName,
        middleName,
        lastName,
        email,
        username,
        role,
        gender,
      }
    );
    return redirect(`/console/employees`, 200);
    // } catch (error) {
    //   return json(
    //     {
    //       errors: {
    //         name: "Error occured while updating product category",
    //         error: error,
    //       },
    //       fields: {
    //         firstName,
    //         middleName,
    //         lastName,
    //         email,
    //         username,
    //         role,
    //         gender,
    //       },
    //     },
    //     { status: 400 }
    //   );
    // }
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
        role: "sales_person",
      }).exec();

      return employees;
    } catch (error) {
      console.error("Error retrieving employees:", error);
    }
  };
}
