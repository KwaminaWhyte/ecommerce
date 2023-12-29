import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import { Cart } from "./Cart";
import EmployeeAuthController from "../employee/EmployeeAuthController";

export default class CartController {
  private request: Request;

  /**
   * Initialize a CartController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
  }

  public addToCart = async ({ product }: { product: string }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    const existingCart = await Cart.findOne({
      employee: cashier,
      product,
    });

    if (existingCart) {
      Cart.findByIdAndUpdate(existingCart._id, {
        $inc: { quantity: 1 },
      }).exec();
    } else {
      const cart = await Cart.create({
        employee: cashier,
        product,
        quantity: 1,
      });

      if (!cart) {
        session.flash("message", {
          title: "Error adding product to cart",
          status: "error",
        });
        return redirect(`/pos/products`, {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }
    }

    session.flash("message", {
      title: "Product Added to Cart",
      status: "success",
    });
    return redirect(`/pos/products`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  public getUserCart = async ({ user }: { user: string }) => {
    try {
      const carts = await Cart.find({ employee: user })
        .populate({
          path: "product",
          populate: [
            { path: "images", model: "images" },
            { path: "category", model: "categories" },
            { path: "stockHistory", model: "stocks" },
          ],
        })
        .populate({
          path: "stock",
          model: "stocks",
        })
        .exec();

      return carts;
    } catch (error) {
      console.error("Error retrieving carts:", error);
    }
  };

  public increaseItem = async ({ product }: { product: string }) => {
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await Cart.findOneAndUpdate(
        { product, employee: cashier },
        {
          $inc: { quantity: 1 }, // Increase the quantity by 1
        }
      ).exec();

      return redirect(`/pos/products`, 200);
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
    stock,
  }: {
    product: string;
    stock: string;
  }) => {
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await Cart.findOneAndUpdate(
        { product, employee: cashier },
        {
          stock,
        }
      ).exec();

      return redirect(`/pos/products`, 200);
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
  public decreaseItem = async ({ product }: { product: string }) => {
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await Cart.findOneAndUpdate(
        { product, employee: cashier },
        {
          $inc: { quantity: -1 }, // Decrease the quantity by 1
        }
      ).exec();

      return redirect(`/pos/products`, 200);
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
  public removeFromCart = async ({ product }: { product: string }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const employeeAuth = await new EmployeeAuthController(this.request);
    const cashier = await employeeAuth.getEmployeeId();

    try {
      await Cart.findOneAndDelete({ employee: cashier, product });
      session.flash("message", {
        title: "Product removed from cart",
        status: "success",
      });
      return redirect(`/pos/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error deleting product from cart",
        status: "error",
      });
      return redirect(`/pos/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
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
      await Cart.findByIdAndUpdate(id, {
        inscription,
      }).exec();

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
}
