import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../shared/models/product";
import { AuthService } from "../../../../shared/services/auth.service";
import { ProductService } from "../../../../shared/services/product.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
import { User } from '../../../../shared/models/user';
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  productList: Product[];
  loading = false;
  brands = ["Todas", "Apple", "LG", "Samsung", "Sony"];
  categorys = ["Todas", "Televisores", "Celulares", "Computadores"];

  selectedBrand: "Todas";
  selectedCategory: "Todas";

  page = 1;

  userDetails: User = new User();
  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private toastrService: ToastrService
  ) {
    var user =  this.authService.user$;
    user.subscribe(result => {
      this.userDetails = result;
    });
  }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.loading = true;
    const x = this.productService.getProducts();
    x.snapshotChanges().subscribe(
      (product) => {
        this.loading = false;
        this.productList = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          this.productList.push(y as Product);
        });
      },
      (err) => {
        this.toastrService.error("Error al obtener los productos", err);
      }
    );
  }

  removeProduct(key: string) {
    this.productService.deleteProduct(key);
  }

  addFavourite(product: Product) {
    delete product.$key;
    const data = {
      product: product,
      userId: this.userDetails.$key,
    }
    this.productService.addFavouriteProduct(data);
    //this.productService.addFavouriteProductToLocal(product); //add to localstorage
  }

  addToCart(product: Product) {
    delete product.$key;
    const data = {
      product: product,
      userId: this.userDetails.$key,
    }
    this.productService.addFavouriteProduct(data);
    //this.productService.addToCartToLocal(product); //add to localstorage
  }
}
