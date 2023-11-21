import { modelsConnector } from "../mongoose.server";

export default class ReportController {
  private request: Request;
  private Employee: any;

  constructor(request: Request) {
    this.request = request;

    return (async (): Promise<ReportController> => {
      await this.initializeModels();
      return this;
    })() as unknown as ReportController;
  }

  private async initializeModels() {
    const { Employee } = await modelsConnector();
    this.Employee = Employee;
  }

  public getEmployee = async (id: string) => {
    try {
      const employee = await this.Employee.findById(id);
      return employee;
    } catch (err) {
      throw err;
    }
  };
}
