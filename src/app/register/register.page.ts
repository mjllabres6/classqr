import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name = "";
  srCode = "";
  password = "";
  section = "";
  constructor(private _router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {

  }

  async register() {
    const body = { srcode: this.srCode, name: this.name, password: this.password, section: this.section }
    const res = await this.http.post<any>('http://127.0.0.1:5000/attendance-api/students', body).toPromise();
    if (res.message == 'Successfully created student record.'){
      this._router.navigate(['login'])

      const alert = await this.alertController.create({
        header: 'Congratulations',
        message: 'You have successfully registered!',
        buttons: ['OK']
      });
  
      await alert.present();

      this.srCode = "";
      this.name = "";
      this.password = "";
      this.section = "";
    } else {
      const alert = await this.alertController.create({
        header: 'Invalid input',
        message: 'You have entered an existing sr-code!',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  toLogin() {
    this._router.navigate(['login'])
  }
}
