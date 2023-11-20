import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";

export default class CartController {
  private request: Request;
  private domain: string;
  private session: any;
  private storage: SessionStorage;
  private Cart: any;
  private Product: any;
  private ProductImages: any;

  /**
   * Initialize a CartController instance
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

    return (async (): Promise<CartController> => {
      await this.initializeModels();
      return this;
    })() as unknown as CartController;
  }

  private async initializeModels() {
    const { Cart, Product, ProductImages } = await connectToDomainDatabase();

    this.Cart = Cart;
    this.Product = Product;
    this.ProductImages = ProductImages;
  }

  private async generateOrderId(prefix: string) {
    const length = 10 - prefix.length;
    const randomString = Math.random()
      .toString(36)
      .substring(2, 2 + length);
    return `${prefix}-${randomString}`;
  }

  public addToCart = async ({
    user,
    product,
  }: {
    user: string;
    product: string;
  }) => {
    const existingCart = await this.Cart.findOne({
      user,
      product,
    });

    if (existingCart) {
      this.Cart.findOneAndUpdate(
        { _id: existingCart._id },
        {
          $inc: { quantity: 1 },
        }
      ).exec();
    } else {
      const cart = await this.Cart.create({
        user,
        product,
        quantity: 1,
      });

      if (!cart) {
        return json(
          {
            error: "Error creating cart",
            fields: {},
          },
          { status: 400 }
        );
      }
    }

    return json({
      status: "success",
    });
  };

  public getUserCart = async ({ user }: { user: string }) => {
    try {
      const carts = await this.Cart.find({ user })
        .populate({
          path: "product",
          populate: [
            { path: "images", model: "product_images" },
            { path: "category", model: "categories" },
            { path: "stockHistory", model: "stock_histories" },
          ],
        })
        .populate({
          path: "stock",
          model: "stock_histories",
        })
        .exec();

      return carts;
    } catch (error) {
      console.error("Error retrieving carts:", error);
    }
  };

  public increaseItem = async ({
    product,
    user,
  }: {
    product: string;
    user: string;
  }) => {
    try {
      await this.Cart.findOneAndUpdate(
        { product, user },
        {
          $inc: { quantity: 1 }, // Increase the quantity by 1
        }
      ).exec();

      return redirect(`/cart`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
      // Handle the error appropriately
    }
  };

  public setStock = async ({
    product,
    user,
    stockId,
  }: {
    product: string;
    user: string;
    stockId: string;
  }) => {
    try {
      await this.Cart.findOneAndUpdate(
        { product, user },
        {
          stock: stockId,
        }
      ).exec();

      return redirect(`/cart`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };

  /**
   * Delete a record from the cart
   * @param param0 id
   * @returns null
   */
  public decreaseItem = async ({
    product,
    user,
  }: {
    product: string;
    user: string;
  }) => {
    try {
      await this.Cart.findOneAndUpdate(
        { product, user },
        {
          $inc: { quantity: -1 }, // Decrease the quantity by 1
        }
      ).exec();

      return redirect(`/cart`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      // Handle the error appropriately
    }
  };

  /**
   * Delete an item from the cart
   * @param id String
   * @returns null
   */
  public deleteItem = async ({ id }: { id: string }) => {
    // delete entry
    try {
      await this.Cart.findByIdAndDelete(id);
      return json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      throw err;
    }
  };

  public addInscription = async ({
    inscription,
    id,
  }: {
    inscription: string;
    id: string;
  }) => {
    try {
      await this.Cart.findOneAndUpdate(
        { _id: id },
        {
          inscription,
        }
      ).exec();

      return redirect(`/cart`, 200);
    } catch (error) {
      console.error("Error decreasing item:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
      // Handle the error appropriately
    }
  };
}
