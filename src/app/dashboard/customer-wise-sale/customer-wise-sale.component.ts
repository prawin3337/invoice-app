import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';
import { groupBy } from "lodash";

@Component({
  selector: 'app-customer-wise-sale',
  templateUrl: './customer-wise-sale.component.html',
  styleUrls: ['./customer-wise-sale.component.less']
})
export class CustomerWiseSaleComponent implements OnInit {

  single: any[];
  view: any[];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme = {
    domain: ["#5AA454", "#E44D25", "#CFC0BB", "#7aa3e5", "#a8385d", "#aae3f5"]
  };

  constructor(private invoiceService: InvoiceService, private authService: AuthService) {}

  ngOnInit(): void {
    let date = new Date().toISOString();

    this.invoiceService.getInvoiceData(date).subscribe((res: any) => {
      let invoiceData = groupBy(res.result, "cust_id");

      let data = [];

      Object.keys(invoiceData).forEach((key) => {
        let obj = {name: key, value: 0};
        invoiceData[key].forEach((invoice) => {
          console.log("invoice=",invoice);
          obj.value += 50;
        });
        data.push(obj);
      });

      console.log("data=",data);
      this.single = data;
            
    });
  }

  onSelect($event) {

  }

}
