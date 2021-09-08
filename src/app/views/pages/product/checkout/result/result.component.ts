import { Product } from "../../../../../shared/models/product";
import { ProductService } from "../../../../../shared/services/product.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";
import { User } from '../../../../../shared/models/user';
import { AuthService } from '../../../../../shared/services/auth.service';
declare var $: any;
@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
})
export class ResultComponent implements OnInit {
  products: Product[];
  date: number;
  totalPrice = 0;
  tax = 0.19;
  userDetails: User = new User();

  constructor(private productService: ProductService, private authService: AuthService) {
    /* Hiding Billing Tab Element */
    document.getElementById("productsTab").style.display = "block";
    document.getElementById("shippingTab").style.display = "block";
    document.getElementById("billingTab").style.display = "block";
    document.getElementById("resultTab").style.display = "block";

    this.date = Date.now();
    this.getUserInformaton();
  }

  ngOnInit() {}

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
        this.products = [];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          allFavourites.push(y as Product);
          const x = allFavourites.filter( item => item.userId ==  this.userDetails.$key);
          console.log(x);

          this.products = x;
          this.getTotalPrice(this.products);

        });
      },
    );
  }

  getTotalPrice(x) {
    x.forEach(item => this.totalPrice += item.product.productPrice);
  }

  downloadReceipt() {
    const data = document.getElementById("receipt");

    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      const pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save(`${this.date}_appTul.pdf`); // Generated PDF
    });
  }

}
