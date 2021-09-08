import { ProductService } from "../../../../../shared/services/product.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Product } from "../../../../../shared/models/product";
import { AuthService } from '../../../../../shared/services/auth.service';
import { User } from '../../../../../shared/models/user';

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  checkoutProducts: Product[];
  userDetails: User = new User();

  totalPrice = 0;
  constructor(private productService: ProductService, private authService: AuthService) {
    document.getElementById("productsTab").style.display = "block";
    document.getElementById("shippingTab").style.display = "none";
    document.getElementById("billingTab").style.display = "none";
    document.getElementById("resultTab").style.display = "none";

    this.getUserInformaton();
  }


  ngOnInit() {
  }

  getUserInformaton() {
    var user =  this.authService.user$;
    user.subscribe( result => {
      this.userDetails =  result;
      this.getCartProduct();
    });
  }

  getCartProduct() {
    const x = this.productService.getCartProducts();
    x.snapshotChanges().subscribe(
      (product) => {
        var allFavourites = [];
        this.checkoutProducts = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          allFavourites.push(y as Product);
          const x = allFavourites.filter( item => item.userId ==  this.userDetails.$key);
          console.log(x);

          this.checkoutProducts = x;
          this.getTotalPrice(this.checkoutProducts);

        });
      },
    );
  }

  getTotalPrice(x) {
    x.forEach(item => this.totalPrice += item.product.productPrice);
  }
}
