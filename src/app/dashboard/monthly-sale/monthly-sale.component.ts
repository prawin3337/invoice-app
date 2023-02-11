import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ProductsService } from '../../services/products.service';
import { chain, groupBy } from "lodash";
import { AuthService } from '../../services/auth.service';

interface Response {
  result: Array<any>
}

@Component({
  selector: 'app-monthly-sale',
  templateUrl: './monthly-sale.component.html',
  styleUrls: ['./monthly-sale.component.less']
})

export class MonthlySaleComponent implements OnInit {

  /**
   * https://swimlane.gitbook.io/ngx-charts/v/docs-test/installing
   * https://github.com/swimlane/ngx-charts/blob/master/projects/swimlane/ngx-charts/package.json#L39
   * https://dzone.com/articles/building-data-visualizations-with-angular-and-ngx
   */

  view: any[];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = `Month's`;
  showYAxisLabel = false;
  yAxisLabel = 'Sales';
  timeline = true;
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };

  //pie
  showLabels = true;
  public single = [];

  public productSale = [];

  constructor(
    private invoiceService: InvoiceService,
    private productsService: ProductsService,
    private authService: AuthService) { }

  ngOnInit() { 

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let date = new Date().toISOString();

    this.invoiceService.getInvoiceData(date).subscribe((res: Response) => {
      res.result.map((obj) => {
        let invoceAmt = 0;
        obj.products.forEach((product) => {
          product.netPrice = this.calculateGst(product.pro_rate, product.pro_gst, product.pro_qty);
          invoceAmt = invoceAmt+product.netPrice;
        });
        obj.invoceAmt = invoceAmt;
      });
      
      let monthGroups = groupBy(res.result, (o) => monthNames[new Date(o.invo_date).getMonth()]);
      
      let monthlySale = this.getMonthlySale(monthGroups);

      let totalSale = Object.keys(monthlySale).reduce((prev, key) => {
          prev = prev+monthlySale[key].value;
          return prev;
      }, 0);

      Object.keys(monthlySale).map((key) => {
        let value = monthlySale[key].value;
        let percentage = Math.round((value/totalSale)*100);
        monthlySale[key].name = `${monthlySale[key].name} (${percentage}%)`;
      });
      this.single = monthlySale;

      this.getAppProducts(res.result);
    });
  }

  calculateGst(productCost, gst, proQty) {
    let batchCost = productCost*proQty;
    let gstAmount = ( batchCost * gst ) / 100;
    let netPrice = batchCost + gstAmount;
    return netPrice;
  }

  getMonthlySale(monthGroups:Object) {
    let monthlySale = [];
    Object.keys(monthGroups).forEach((key) => {
      let obj = {name: key, value: 0};
      monthGroups[key].forEach((invoice) => {
        obj.value = obj.value+invoice.invoceAmt;
      });
      monthlySale.push(obj);
    });
   return monthlySale;    
  }

  getAppProducts(invoices:Array<any>) {
    let products = [];
    invoices.forEach((invoice) => {
      products.push(...invoice.products);
    });
    console.log(groupBy(products, 'pro_det'));

    let productGroup = groupBy(products, (obj) => obj.pro_det.substring(0, 10));
    this.productSale = this.totalProductSale(productGroup);
    
  }

  totalProductSale(productGroup: Object) {
    let totalProductSale = [];
    Object.keys(productGroup).forEach((key) => {
      let obj = {name: key, value: 0};
      productGroup[key].forEach((product) => {
        obj.value = obj.value+product.netPrice;
      });
      totalProductSale.push(obj);
    });
   return totalProductSale;    
  }

  onSelect($event) {

  }
}
