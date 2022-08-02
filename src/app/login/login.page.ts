import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global/global.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  srCode = "";
  password = "";
  constructor(private _router: Router, private http: HttpClient, private globalService: GlobalService, private alertController: AlertController) { }

  ngOnInit() {
  }

  async login() {

    const body = { srcode: this.srCode, password: this.password }
    const res = await this.http.post<any>('http://127.0.0.1:5000/attendance-api/students/login', body).toPromise();
    if (res.message == 'Found a match on a student record.'){
      this.globalService.setType(true);
      this.globalService.setCode(this.srCode)
      this.globalService.setName(res.name);
      this.globalService.setSection(res.section);
      this.srCode = "";
      this.password = "";
      this._router.navigate(['scan']);
    } else {
      const alert = await this.alertController.create({
        header: 'Invalid input',
        message: 'Invalid sr-code or password!',
        buttons: ['OK']
      });
  
      await alert.present();
      this.srCode = "";
      this.password = "";
    }
 
  } 

  async loginAsProf() {
    const body = { prof_code: this.srCode, password: this.password }
    const res = await this.http.post<any>('http://127.0.0.1:5000/attendance-api/prof/login', body).toPromise();
    if (res.message == 'Found a match on a prof record.'){
      this.globalService.setType(false);
      this.globalService.setCode(this.srCode)
      this.globalService.setName(res.name)
      this.srCode = "";
      this.password = "";
      this._router.navigate(['classes'])
    } else {
      const alert = await this.alertController.create({
        header: 'Invalid input',
        message: 'Invalid prof code or password!',
        buttons: ['OK']
      });
  
      await alert.present();

      this.srCode = "";
      this.password = "";
    }
  }

  toRegister() {
    this._router.navigate(['register'])
  }
}
