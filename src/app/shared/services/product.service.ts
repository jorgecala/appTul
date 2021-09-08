import { Injectable } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import { Product } from "../models/product";
import { AuthService } from "./auth.service";
import { ToastrService } from "./toastr.service";

@Injectable()
export class ProductService {
  products: AngularFireList<Product>;
  product: AngularFireObject<Product>;

  // favouriteProducts
  favouriteProducts: AngularFireList<FavouriteProduct>;
  cartProducts: AngularFireList<FavouriteProduct>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.getFavouriteProducts();
    this.getUsersFavouriteProduct();
    this.getFavouriteProducts();
    this.getCartProducts();
  }

  getProducts() {
    this.products = this.db.list("products");
    return this.products;
  }

  getFavouriteProducts() {
    this.favouriteProducts = this.db.list("favouriteProducts");
    return this.favouriteProducts;
  }

  getCartProducts() {
    this.cartProducts = this.db.list("cartProducts");
    return this.cartProducts;
  }

  createProduct(data: Product, callback: () => void) {
    this.products.push(data);
    callback();
  }

  getProductById(key: string) {
    this.product = this.db.object("products/" + key);
    return this.product;
  }

  updateProduct(data: Product) {
    this.products.update(data.$key, data);
  }

  deleteProduct(key: string) {
    this.products.remove(key);
  }

  // Get Favourite Product based on userId
  async getUsersFavouriteProduct() {
    const user = await this.authService.user$.toPromise();
    this.favouriteProducts = this.db.list("favouriteProducts", (ref) =>
      ref.orderByChild("userId").equalTo(user.$key)
    );
    console.log('1', this.favouriteProducts);
    return this.favouriteProducts;
    return new Promise((res, rej) => {
      res([]);
    });
  }

  // Adding New product to favourite if logged else to localStorage
  addFavouriteProduct(data: FavouriteProduct) {
    this.favouriteProducts.push(data);
    this.toastrService.wait("Agregando producto", "Producto agregado como favorito");
  }

  // Adding New product to favourite if logged else to localStorage
  addFavouriteProductToLocal(data: Product): void {
    const a: Product[] = JSON.parse(localStorage.getItem("avf_item")) || [];
    a.push(data);
    this.toastrService.wait("Adding Product", "Adding Product as Favourite");
    setTimeout(() => {
      localStorage.setItem("avf_item", JSON.stringify(a));
    }, 1500);
  }

  // Fetching unsigned users favourite proucts
  getLocalFavouriteProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avf_item")) || [];

    return products;
  }

  // Removing Favourite Product from Database
  removeFavourite(key) {
    this.favouriteProducts.remove(key);
  }

  // Removing Favourite Product from localStorage
  removeLocalFavourite(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avf_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avf_item", JSON.stringify(products));
  }


  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: FavouriteProduct) {
    this.cartProducts.push(data);
    this.toastrService.wait(
      "Agregando el producto al carrito",
      "Producto agregado al carrito"
    );
  }

  // Adding new Product to cart db if logged in else localStorage
  addToCartToLocal(data: Product): void {
    const a: Product[] = JSON.parse(localStorage.getItem("avct_item")) || [];
    a.push(data);

    this.toastrService.wait(
      "Adding Product to Cart",
      "Product Adding to the cart"
    );
    setTimeout(() => {
      localStorage.setItem("avct_item", JSON.stringify(a));
    }, 500);
  }

  // Removing cart from local
  removeLocalCartProduct(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avct_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avct_item", JSON.stringify(products));
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];

    return products;
  }
}

export class FavouriteProduct {
  product: Product;
  userId: string;
}
