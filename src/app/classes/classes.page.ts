import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Subjects } from './classes.module';

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
  

  public imageSource: any;
  public subjects: Subjects[];
  public receiver: any;
  public selectedSubject: string;

  public statusIcon: string = "checkmark-circle-outline"
  public status: string = "success";
  
  constructor(private http: HttpClient) { 
    this.setSubjects()
  }

  ngOnInit() {
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
    const body = {subject_id: currentSubject._id, duration: "1"}
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
    this.receiver = await this.http.get<any>('http://127.0.0.1:5000/attendance-api/prof/62c92ff3c6466f57cad07b7e/subjects').toPromise();
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

  endClass(){
    this.classEnded = true;
    this.status = "danger"
    this.statusIcon = "close-circle-outline"
  }
}
