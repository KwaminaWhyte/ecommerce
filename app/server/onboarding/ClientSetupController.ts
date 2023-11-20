import {
  type SessionStorage,
  createCookieSessionStorage,
  json,
  redirect,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { connectToDomainDatabase } from "../mongoose.server";
import SenderController from "../notification/SenderController";

export default class ClientSetupController {
  private request: Request;
  private domain: string;
  private storage: SessionStorage;
  private ClientConnection: any;
  private ClientDetail: any;

  /**
   * Initialize a ClientSetupController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
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

    return (async (): Promise<ClientSetupController> => {
      await this.initializeModels();
      return this;
    })() as unknown as ClientSetupController;
  }

  private async initializeModels() {
    const { ClientConnection, ClientDetail } = await connectToDomainDatabase();
    this.ClientConnection = ClientConnection;
    this.ClientDetail = ClientDetail;
  }

  private async createClientSession(userId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getClientSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  public async getClientId() {
    const session = await this.getClientSession();
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      return null;
    }
    return userId;
  }

  private createSetupSession = async (
    connectionId: string,
    connectionDomain: string,
    redirectTo: string
  ) => {
    const session = await this.storage.getSession();
    session.set("connectionId", connectionId);
    session.set("connectionDomain", connectionDomain);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  };

  private getSetupSession = async (request: Request) => {
    return this.storage.getSession(request.headers.get("Cookie"));
  };

  public createProfile = async ({
    username,
    email,
    phone,
    password,
  }: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const existingProfile = await this.ClientDetail.findOne({ email });

    if (existingProfile) {
      return json(
        { message: "No account associated with this Email", type: "error" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let profile = await this.ClientDetail.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    return this.createClientSession(
      profile._id,
      "/setup/account_setup/store_info"
    );
  };

  public createStore = async ({
    name: storeName,
    email,
    phone,
  }: {
    name: string;
    email: string;
    phone: string;
  }) => {
    let userId = await this.getClientId();

    await this.ClientConnection.create({
      admin: userId,
      storeName,
      email,
      phone,
    });

    return redirect("/setup/account_setup/domain");
  };

  public getStore = async () => {
    let userId = await this.getClientId();

    let store = await this.ClientConnection.findOne({
      admin: userId,
    });

    return store;
  };

  public storeDomain = async ({
    domain,
    database,
  }: {
    domain: string;
    database: string;
  }) => {
    let userId = await this.getClientId();
    let databaseUri = process.env.RAW_DATABASE_URL + database;

    await this.ClientConnection.findOneAndUpdate(
      {
        admin: userId,
      },
      {
        domain,
        databaseUri,
      }
    );

    let storeDetails = await this.getStore();
    const senderController = await new SenderController(this.request);
    await senderController.sendEmail({
      from: '"ComClo" <isupport@medsov.com>',
      to: `"${storeDetails.name}" <${storeDetails.email}>`,
      subject: "Congratulations",
      body: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to [Your SaaS Name]</title>
          <style>
              /* Add your CSS styles here */
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
              }
      
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
      
              .header img {
                  max-width: 100px;
              }
      
              .message {
                  padding: 20px;
              }
      
              .message h2 {
                  color: #333;
                  font-size: 24px;
                  margin: 0;
              }
      
              .message p {
                  color: #555;
                  font-size: 16px;
              }
      
              .button {
                  text-align: center;
                  margin-top: 20px;
              }
      
              .button a {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://your-saas.com/logo.png" alt="SaaS Logo">
                  <h1>Welcome to [Your SaaS Name]</h1>
              </div>
              <div class="message">
                  <h2>Hello [User's Name],</h2>
                  <p>Thank you for choosing [Your SaaS Name]. We are excited to have you on board!</p>
                  <p>You now have access to a powerful set of tools and features to help streamline your business operations.</p>
                  <p>To get started:</p>
                  <ol>
                      <li>Log in to your account using your credentials.</li>
                      <li>Explore our user-friendly dashboard to manage your business tasks.</li>
                      <li>If you have any questions or need assistance, our support team is here to help.</li>
                  </ol>
                  <p>We hope you find [Your SaaS Name] a valuable asset for your business. We're dedicated to providing you with the best experience possible.</p>
              </div>
              <div class="button">
                  <a href="https://your-saas.com/login" target="_blank">Log In</a>
              </div>
          </div>
      </body>
      </html>`,
    });
    return redirect(`/setup/congratulations/${userId}`);
  };

  public createDbConnection = async (domain: string, database: string) => {
    //   let host = request.headers.get("host") as string;
    //   const client = await prisma(host.split(":")[0]);
    //   await connectClient(domain);
    const existingClient = await this.ClientConnection.findOne({ domain });

    if (existingClient) {
      return json(
        {
          errors: { name: "Domain already exists" },
          fields: { database, domain },
        },
        { status: 400 }
      );
    }

    database = (process.env.RAW_DATABASE_URL as string) + database;
    // create new client connection
    const connection = await this.ClientConnection.create({
      domain,
      databaseUrl: database,
    });

    if (!connection) {
      return json(
        {
          error: "Error creating client database connection",
          fields: { domain, database },
        },
        { status: 400 }
      );
    }

    return createSetupSession(connection.id, domain, `/console/step_two`);
    // return redirect("/console/signup", 200);
  };

  public getCompleteSetup = async (id: string) => {
    let admin = await this.ClientDetail.findById(id);
    let connectionInfo = await this.ClientConnection.findOne({ admin: id });

    return { admin, connectionInfo };
  };
}