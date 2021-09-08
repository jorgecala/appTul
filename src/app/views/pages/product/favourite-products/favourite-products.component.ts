import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../shared/models/product";
import { ProductService, FavouriteProduct } from '../../../../shared/services/product.service';
import { User } from '../../../../shared/models/user';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../../../shared/services/auth.service';
@Component({
  selector: "app-favourite-products",
  templateUrl: "./favourite-products.component.html",
  styleUrls: ["./favourite-products.component.scss"],
})
export class FavouriteProductsComponent implements OnInit {
  favoruiteProducts: any = new FavouriteProduct();
  f = true;
  userDetails: User = new User();

  // Not Found Message
  messageTitle = "No hay productos registrados";
  messageDescription = "Si deseas, puedes añadir tus prodcutos favoritos";

  constructor(private productService: ProductService, private authService: AuthService) {

  }

  ngOnInit() {
    this.getUserInformaton();
  }

  getUserInformaton() {
    var user =  this.authService.user$;
    user.subscribe( result => {
      this.userDetails =  result;
      this.getFavouriteProduct();
    });
  }

  removeFavourite(product) {
    const data = {
      product: {
        product,
        userId: this.userDetails.$key,
      }
    }
    this.productService.removeFavourite(data);
    //this.productService.removeLocalFavourite(product); //remove from local

    this.getFavouriteProduct();
  }

  getFavouriteByUser(){
    this.favoruiteProducts = this.productService.getUsersFavouriteProduct();
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
}
