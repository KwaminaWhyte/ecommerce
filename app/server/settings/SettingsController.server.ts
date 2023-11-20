import axios from "axios";
import { connectToDomainDatabase } from "../mongoose.server";
import { json } from "@remix-run/node";

export default class SettingsController {
  private request: Request;
  private domain: string;
  private Notification: any;
  private SMSSettings: any;
  private GeneralSettings: any;
  private PaymentApi: any;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<SettingsController> => {
      // Call async functions here
      // await sleep(500);
      await this.initializeModels();
      // Constructors return `this` implicitly, but this is an IIFE, so
      // return `this` explicitly (else we'd return an empty object).
      return this;
    })() as unknown as SettingsController;
  }

  private async initializeModels() {
    const { NotificationSettings, SMSSettings, GeneralSettings, PaymentApi } =
      await connectToDomainDatabase();
    this.PaymentApi = PaymentApi;
    this.Notification = NotificationSettings;
    this.SMSSettings = SMSSettings;
    this.GeneralSettings = GeneralSettings;
  }

  public getGeneralSettings = async () => {
    const settings = await this.GeneralSettings.findOne();
    return settings;
  };

  public updateGeneralSettings = async ({
    businessName,
    slogan,
    email,
    phone,
    orderIdPrefix,
    allow_inscription,
  }: {
    businessName: string;
    slogan: string;
    email: string;
    phone: string;
    orderIdPrefix: string;
    allow_inscription: string;
  }) => {
    try {
      // Check if the settings record already exists in the database
      const existingSettings = await this.GeneralSettings.findOne();

      // If the settings record exists, update it
      if (existingSettings) {
        existingSettings.businessName = businessName;
        existingSettings.slogan = slogan;
        existingSettings.email = email;
        existingSettings.phone = phone;
        existingSettings.orderIdPrefix = orderIdPrefix;
        existingSettings.allowInscription = allow_inscription == "true" ? 1 : 0;

        await existingSettings.save();
      } else {
        // If the settings record doesn't exist, create a new one
        const newSettings = new this.GeneralSettings({
          businessName,
          slogan,
          email,
          phone,
          orderIdPrefix,
          allowInscription: allow_inscription == "true" ? 1 : 0,
        });

        await newSettings.save();
      }

      // Respond with a success messag
      return json({ message: "Success" }, 200);
    } catch (err) {
      // Handle errors
      return json({ message: "Success", error: err }, 200);
    }
  };

  public getNotificationSettings = async () => {
    return "notification settings...";
  };

  public updateNotification = async ({
    item1,
    item2,
  }: {
    item1: string;
    item2: string;
  }) => {
    return "notification settings...";
  };

  public getAllPaymentApis = async () => {
    let apis = await this.PaymentApi.find();
    return apis;
  };

  public getPaymentSettings = async () => {
    return json({ message: "Success" }, 200);
  };

  public updatePaymentSettings = async () => {
    return json({ message: "Success" }, 200);
  };

  public getEmailGateway = async () => {
    let settings = await this.SMSSettings.findOne();
    return settings;
  };

  public updateEmailGateway = async ({
    api_key,
    api_token,
    api_endpoint,
  }: {
    api_key: string;
    api_token: string;
    api_endpoint: string;
  }) => {
    try {
      // Check if the settings record already exists in the database
      const existingSettings = await this.SMSSettings.findOne();

      // If the settings record exists, update it
      if (existingSettings) {
        existingSettings.api_key = api_key;
        existingSettings.api_token = api_token;
        existingSettings.api_endpoint = api_endpoint;
        // Update other fields as needed

        await existingSettings.save();
      } else {
        // If the settings record doesn't exist, create a new one
        const newSettings = new this.SMSSettings({
          api_key: api_key,
          api_token: api_token,
          api_endpoint: api_endpoint,
        });

        await newSettings.save();
      }

      // Respond with a success messag
      return json({ message: "Success" }, 200);
    } catch (err) {
      // Handle errors
      return json({ message: "Success", error: err }, 200);
    }
  };

  public getSmsGateway = async () => {
    let settings = await this.SMSSettings.findOne();
    return settings;
  };

  public updateSmsGateway = async ({
    api_key,
    api_token,
    api_endpoint,
  }: {
    api_key: string;
    api_token: string;
    api_endpoint: string;
  }) => {
    try {
      // Check if the settings record already exists in the database
      const existingSettings = await this.SMSSettings.findOne();

      // If the settings record exists, update it
      if (existingSettings) {
        existingSettings.api_key = api_key;
        existingSettings.api_token = api_token;
        existingSettings.api_endpoint = api_endpoint;
        // Update other fields as needed

        await existingSettings.save();
      } else {
        // If the settings record doesn't exist, create a new one
        const newSettings = new this.SMSSettings({
          api_key: api_key,
          api_token: api_token,
          api_endpoint: api_endpoint,
        });

        await newSettings.save();
      }

      // Respond with a success messag
      return json({ message: "Success" }, 200);
    } catch (err) {
      // Handle errors
      return json({ message: "Success", error: err }, 200);
    }
  };

  public sendSMS = async (userData) => {
    const random_numbers = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Assuming you have a function to make the HTTP POST request called httpPost
    await this.httpPost({
      from: "KWhyte",
      to: this.cleanPhoneNumber("0248048753"),
      message: `Your verification code is: ${random_numbers}. Please enter this code on our portal to gain access. Code expires in 5 minutes.`,
      refId: `ref_${Date.now()}`,
    });
  };

  private cleanPhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/[\s/\\]/g, ""); // Remove spaces, slashes, and backslashes
    phoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "233" + phoneNumber.substring(1); // Replace leading '0' with '233'
    }
    return phoneNumber;
  }

  // Assuming you have a function to make the HTTP POST request called httpPost
  private httpPost = async (data) => {
    let settings = await this.SMSSettings.findOne();

    return axios
      .post(`${settings.api_endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${settings.api_key}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return json({ message: "Success", response }, 200);
      })
      .catch((error) => console.error(error));
  };
}