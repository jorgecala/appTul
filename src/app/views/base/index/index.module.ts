import { SharedModule } from "./../../../shared/shared.module";

import { ProductModule } from "../../pages/product/product.module";
// Core Dependencies
import { RouterModule } from "@angular/router";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IndexRoutes } from "./index.routing";

// Components
import { IndexComponent } from "./index.component";
import { LoginComponent } from "./login/login.component";
import { NavbarComponent } from "./navbar/navbar.component";

@NgModule({
  imports: [
    CommonModule,
    ProductModule,
    SharedModule,
    RouterModule.forChild(IndexRoutes),
  ],
  declarations: [
    IndexComponent,
    NavbarComponent,
    LoginComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [NavbarComponent],
  providers: [],
})
export class IndexModule {}
