import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  isStudent = false;

  constructor(private globalService: GlobalService, private _router: Router) {
    
  }

  ngOnInit() {
    this.isStudent = this.globalService.getType();
  }

  logout(){
    this._router.navigate(['login']);
  }

}
