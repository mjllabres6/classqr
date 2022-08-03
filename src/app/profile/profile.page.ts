import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BooleanValueAccessor } from '@ionic/angular';
import { GlobalService } from '../global/global.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public srcode: string;
  public isStudent: boolean;
  public type: string;
  public name: string;
  public color: string;
  public section: string;
  attendance = [];
  classes = [];
  constructor(public globalService: GlobalService, private http: HttpClient) { }

  ngOnInit() {
    this.srcode = this.globalService.getCode();
    this.isStudent = this.globalService.getType();
    this.name = this.globalService.getName();
    

    if (this.isStudent) {
      this.type = "Student"
      this.color = "success"
      this.section = this.globalService.getSection();
      this.getAttendance();
    } else {
      this.type = "Professor"
      this.color = "primary"
      this.getClasses();
    }
  }


  async getAttendance(){
    const res = await this.http.get<any>(`http://127.0.0.1:5000/attendance-api/classes/${this.srcode}/attended`).toPromise();
    this.attendance = res.results;
  }

  async getClasses(){
    const res = await this.http.get<any>(`http://127.0.0.1:5000/attendance-api/classes/${this.srcode}/conducted`).toPromise();
    this.classes = res.results;
  }

  exportLink(code) {
    return `http://127.0.0.1:5000/attendance-api/classes/${code}/export`
  }

}
