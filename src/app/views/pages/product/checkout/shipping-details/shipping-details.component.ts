import { Product } from "../../../../../shared/models/product";
import { ShippingService } from "../../../../../shared/services/shipping.service";
import { UserDetail, User } from "../../../../../shared/models/user";
import { AuthService } from "../../../../../shared/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { ProductService } from "../../../../../shared/services/product.service";
import { map } from "rxjs/operators";
import { ToastrService } from '../../../../../shared/services/toastr.service';
@Component({
  selector: "app-shipping-details",
  templateUrl: "./shipping-details.component.html",
  styleUrls: ["./shipping-details.component.scss"],
})
export class ShippingDetailsComponent implements OnInit {


  userDetails: User = new User();
  products: Product[];
  userDetail: UserDetail = new UserDetail();

  constructor(
    private authService: AuthService,
    private shippingService: ShippingService,
    productService: ProductService,
    private router: Router,
    private toastService: ToastrService,
  ) {
    /* Hiding products Element */
    document.getElementById("productsTab").style.display = "block";
    document.getElementById("shippingTab").style.display = "block";
    document.getElementById("billingTab").style.display = "none";
    document.getElementById("resultTab").style.display = "none";
    this.products = productService.getLocalCartProducts();
    var user =  this.authService.user$;
    user.subscribe(result => {
      this.userDetails = result;
    });
  }

  ngOnInit(): void {
  }

  updateUserDetails(form: NgForm) {
    if (form.valid) {
      const products = [];
      let totalPrice = 0;
      this.products.forEach((product) => {
        delete product.$key;
        totalPrice += product.productPrice;
        products.push(product);
      });
      const data = {
        ...form.value,
        emailId: this.userDetails.emailId,
        userId: this.userDetails.$key,
        products,
        totalPrice,
        shippingDate: Date.now(),
      };

      this.shippingService.createshippings(data);
      this.toastService.success(
        "Registro de dirección exitoso",
        "Tu dirección de facturación ha sido registrada."
      );

      this.router.navigate([
        "checkouts",
        { outlets: { checkOutlet: ["billing-details"] } },
      ]);
    } else {
      form.control.markAllAsTouched();
        this.toastService.error(
          "Registro de dirección fallido",
          "Por favor completa los campos del formulario."
        );
      }
  }

}


