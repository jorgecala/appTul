import { Component, OnInit, VERSION } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./../../../../shared/services/auth.service";
import { ProductService } from "./../../../../shared/services/product.service";
import { User } from '../../../../shared/models/user';
import { FavouriteProduct } from '../../../../shared/services/product.service';
import { Product } from '../../../../shared/models/product';

declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {

  favoruiteProducts: any = new FavouriteProduct();
  cartProducts: any = new FavouriteProduct();
  f = true;
  userDetails: User = new User();

  constructor(
    public authService: AuthService,
    private router: Router,
    public productService: ProductService,
  ) {
  }

  ngOnInit() {
    this.getUserInformaton();
  }

  getUserInformaton() {
    var user =  this.authService.user$;
    user.subscribe( result => {
      this.userDetails =  result;
      this.getFavouriteProduct();
      this.getCartProducts();
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  getFavouriteProduct() {
    const x = this.productService.getFavouriteProducts();
    x.snapshotChanges().subscribe(
      (product) => {
        var allFavourites = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          allFavourites.push(y as Product);
          this.favoruiteProducts = [];
          allFavourites.forEach( item => {
             if(item.userId == this.userDetails.$key) {
               this.favoruiteProducts.push(item.product);
             }
          });

        });
      },
    );
  }

  getCartProducts() {
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
