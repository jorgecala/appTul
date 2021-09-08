import { Product } from "../../../../shared/models/product";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../../shared/services/product.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
import { User } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private sub: any;
  product: Product;
  userDetails: User = new User();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastrService: ToastrService,
    private authService:AuthService
  ) {
    this.product = new Product();
    var user =  this.authService.user$;
    user.subscribe(result => {
      this.userDetails = result;
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      const id = params.id; // (+) converts string 'id' to a number
      this.getProductDetail(id);
    });
  }

  getProductDetail(id: string) {
    const x = this.productService.getProductById(id);
    x.snapshotChanges().subscribe(
      (product) => {
        const y = { ...(product.payload.toJSON() as Product), $key: id };
        this.product = y;
      },
      (error) => {
        this.toastrService.error("Hubo un error al cargar los productos", error);
      }
    );
  }

  addToCart(product: Product) {
    delete product.$key;
    const data = {
      product: product,
      userId: this.userDetails.$key,
    }
    this.productService.addToCart(data);
    //this.productService.addToCartToLocal(product); //add to localstorage
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
