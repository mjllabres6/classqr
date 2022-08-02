import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Subjects } from './classes.module';
import * as moment from 'moment';
import { GlobalService } from '../global/global.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {
  public image : any;



  public showQR: boolean;
  public showGet: boolean;
  public classEnded: boolean;
  public classCode: any;
  public studentCount: number = 0;
  

  public imageSource: any;
  public subjects: Subjects[];
  public receiver: any;
  public selectedSubject: string;

  public statusIcon: string = "checkmark-circle-outline"
  public status: string = "success";
  public addActive: boolean;
  public newSubjectName: string = "";
  public csv:any;
  dateToday: any = null;
  public exportLink: string;

  
  constructor(private http: HttpClient, private globalService: GlobalService, private _router: Router, private alertController: AlertController) { 
    
  }

  ngOnInit() {
    this.setSubjects()
    if (this.globalService.getType()) {
      this._router.navigate(['scan']);
    }
  }

  async getImage(){
    const httpOptions : Object = {
      headers: new HttpHeaders({
        'Accept': 'text/html',
        'Content-Type': 'image/png; charset=utf-8',
      }),
      responseType: 'blob'
    };

    const currentSubject = this.subjects.find(i => i.name == this.selectedSubject)
    this.image = await this.http.get<any>(`http://127.0.0.1:5000/attendance-api/classes/${this.classCode.code}`, httpOptions).toPromise();

    this.imageSource = window.URL.createObjectURL(this.image);
  }

  async createClass(){
    const currentSubject = this.subjects.find(i => i.name == this.selectedSubject)
    const body = {subject_name: currentSubject.name, duration: "1", prof_code: this.globalService.getCode()}
    this.dateToday = moment().format('LL')
    this.classCode = await this.http.post<any>('http://127.0.0.1:5000/attendance-api/classes', body).toPromise();
  }

  
  async getQR(){
    this.showGet = false
   
    this.createClass().then(() => {
      this.getImage().then(() => {
        this.showQR = true;
      });
    });

  }

  async getSubjects(){
    const sr = this.globalService.getCode()

    this.receiver = await this.http.get<any>(`http://127.0.0.1:5000/attendance-api/prof/${sr}/subjects`).toPromise();
    this.subjects = this.receiver.data
  }

  async setSubjects(){
    this.getSubjects().then(() => {
      this.subjects = this.subjects
    });
  }

  selected(){
    this.showGet = true
  }

  toggleAdd(){
    this.addActive = !this.addActive;
  }

  async addSubject(){
    const sr = this.globalService.getCode()
    const body = { name: this.newSubjectName, prof_code: sr}
    const res = await this.http.post<any>('http://127.0.0.1:5000/attendance-api/subjects', body).toPromise();
    if (res.message == 'Successfully created subject.'){
      this.addActive = false;

      const alert = await this.alertController.create({
        header: 'Subject added',
        message: `You have added a new subject!`,
        buttons: ['OK']
      });
  
      await alert.present();
      this.setSubjects();
    }
  }

  endClass(){
    this.classEnded = true;
    this.status = "danger"
    this.statusIcon = "close-circle-outline"
    this.exportLink = `http://127.0.0.1:5000/attendance-api/classes/${this.classCode.code}/export`
  }

  async getAttendanceCount(){
    const res = await this.http.get<any>(`http://127.0.0.1:5000/attendance-api/classes/${this.classCode.code}/count`).toPromise();
    this.studentCount = res.count
  }

  reset() {
    this.classEnded = false;
    this.addActive = false;
    this.showQR = false;
    this.showGet = true;
    this.selectedSubject = "";
    this.status = "success"
    this.statusIcon = "checkmark-circle-outline"
  }
  

}
