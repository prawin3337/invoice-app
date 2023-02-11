import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router:Router) {}

  ngOnInit(): void {
    let sessionData = this.route.snapshot.paramMap.get('sessionData');
    if(sessionData) {
      // This will redirect to old PHP site.
      let url = environment.ngRedirect+"?sessionData="+sessionData;
      window.parent.location.href = url;
      //window.open(url);
    } else {
      window.parent.location.href = environment.phpHome;
    }
    
  }

}
