import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import JSPDF from 'jspdf';
import { config } from 'process';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrls: ['./view-purchase-order.component.less']
})
export class ViewPurchaseOrderComponent implements OnInit {

  @ViewChild('htmlData') htmlData:ElementRef;


  constructor() { }

  ngOnInit(): void {
    //let tp = new CustomEvent("abc", {detail: {}})
  }

  // public openPDF():void {
  //   let DATA = this.htmlData.nativeElement;
  //   let doc = new JSPDF('p','pt', 'a4');
  //   doc.html(DATA, {
  //     callback: (doc) => {
  //       doc.output("dataurlnewwindow");
  //     }
  //   });
  // }


  // public downloadPDF():void {
  //   let DATA = this.htmlData.nativeElement;
  //   let doc = new JSPDF('p','pt', 'a4');

  //   let handleElement = {
  //     '#editor':function(element,renderer){
  //       return true;
  //     }
  //   };

  //   doc.html(DATA.innerHTML, {
  //     html2canvas: {
  //       width: 200,
  //     },
  //     callback: () => {
  //       // doc.save("test.pdf");
  //       doc.saveGraphicsState();
  //     }      
  //   });
    
  // }

}
