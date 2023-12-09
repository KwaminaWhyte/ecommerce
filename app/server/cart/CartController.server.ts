import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import { commitSession, getSession } from "~/session";
import { Cart } from "./Cart";

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

  public addToCart = async ({
    employee,
    product,
  }: {
    employee: string;
    product: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    const existingCart = await Cart.findOne({
      employee,
      product,
    });

    if (existingCart) {
      Cart.findByIdAndUpdate(existingCart._id, {
        $inc: { quantity: 1 },
      }).exec();
    } else {
      const cart = await Cart.create({
        employee,
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

    return json({
      status: "success",
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
    employee,
  }: {
    product: string;
    employee: string;
  }) => {
    try {
      await Cart.findOneAndUpdate(
        { product, employee },
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
    employee,
    stock,
  }: {
    product: string;
    employee: string;
    stock: string;
  }) => {
    try {
      await Cart.findOneAndUpdate(
        { product, employee },
        {
          stock,
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
    employee,
  }: {
    product: string;
    employee: string;
  }) => {
    try {
      await Cart.findOneAndUpdate(
        { product, employee },
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
      await Cart.findByIdAndDelete(id);
      return json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      console.log(err);
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
      // Handle the error appropriately
    }
  };
}
