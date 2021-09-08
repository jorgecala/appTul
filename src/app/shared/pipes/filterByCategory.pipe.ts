import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterByCategory",
})

export class FilterByCategoryPipe implements PipeTransform {
  transform(items: any, select?: any): any {
    if (select !== "Todas") {
      return select
        ? items.filter(
            (item: { productCategory: any }) => item.productCategory === select
          )
        : items;
    } else {
      return items;
    }
  }
}