import { ProductService } from "../../../../../shared/services/product.service";
import { Product } from "../../../../../shared/models/product";
import { BillingService } from "../../../../../shared/services/billing.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { User, UserDetail } from "../../../../../shared/models/user";
import { AuthService } from "../../../../../shared/services/auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { map } from "rxjs/operators";
import { ToastrService } from '../../../../../shared/services/toastr.service';

@Component({
  selector: "app-billing-details",
  templateUrl: "./billing-details.component.html",
  styleUrls: ["./billing-details.component.scss"],
})
export class BillingDetailsComponent implements OnInit {
  userDetails: User = new User();
  products: Product[];
  userDetail: UserDetail = new UserDetail();

  constructor(
    private authService: AuthService,
    private billingService: BillingService,
    productService: ProductService,
    private router: Router,
    private toastService: ToastrService,
  ) {
    /* Hiding products Element */
    document.getElementById("productsTab").style.display = "block";
    document.getElementById("shippingTab").style.display = "block";
    document.getElementById("billingTab").style.display = "block";
    document.getElementById("resultTab").style.display = "none";

    this.products = productService.getLocalCartProducts();
    var user =  this.authService.user$;
    user.subscribe(result => {
      this.userDetails = result;
    });
  }

  ngOnInit() {}

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

      this.billingService.createBillings(data);
      this.toastService.success(
        "Registro de dirección exitoso",
        "Tu dirección de envío ha sido registrada."
      );

      this.router.navigate([
        "checkouts",
        { outlets: { checkOutlet: ["result"] } },
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
