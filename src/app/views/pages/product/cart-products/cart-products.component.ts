import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../shared/models/product";
import { ProductService } from "../../../../shared/services/product.service";
import { User } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
@Component({
  selector: "app-cart-products",
  templateUrl: "./cart-products.component.html",
  styleUrls: ["./cart-products.component.scss"],
})
export class CartProductsComponent implements OnInit {
  cartProducts: Product[];
  showDataNotFound = true;

  // Not Found Message
  messageTitle = "No hay productos en tu carrito";
  messageDescription = "Si deseas, añade productos al carrito";

  userDetails: User = new User();

  constructor(private productService: ProductService, private authService: AuthService) {}

  ngOnInit() {
    this.getUserInformaton();
  }

  getUserInformaton() {
    var user =  this.authService.user$;
    user.subscribe( result => {
      this.userDetails =  result;
      this.getCartProduct();
    });
  }

  removeCartProduct(product: Product) {
    this.productService.removeLocalCartProduct(product); //remove from local

    // Recalling
    this.getCartProduct();
  }

  getCartProduct() {
    const x = this.productService.getCartProducts();
    x.snapshotChanges().subscribe(
      (product) => {
        var allFavourites = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          allFavourites.push(y as Product);
          this.cartProducts = [];
          allFavourites.forEach( item => {
             if(item.userId == this.userDetails.$key) {
               this.cartProducts.push(item.product);
             }
          });

        });
      },
    );
  }
}
