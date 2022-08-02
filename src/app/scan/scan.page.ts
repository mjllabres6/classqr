import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { ClassesPage } from '../classes/classes.page';
import jsQR from 'jsqr';
import { GlobalService } from '../global/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {
  scannedCode = null;
  scanner = null;
  showScan = false;
  loading: HTMLIonLoadingElement;
  
  @ViewChild('video', {static: false}) video: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;


  constructor(private loadingCtrl: LoadingController, private http: HttpClient, private globalService: GlobalService, private _router: Router, private alertController: AlertController) { 
    
  }

  ngAfterViewInit(){
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d')
  }

  ngOnInit() {

  }

  async scan(){
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment'}
    })

    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true)
    this.videoElement.play();
    this.loading = await this.loadingCtrl.create({})

    await this.loading.present();
    requestAnimationFrame(this.readQR.bind(this));
  }

  async readQR(){
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA){
      if (this.loading){
        await this.loading.dismiss();
        this.loading = null;
        this.showScan = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code){
        if ('data' in code && code.data.length == 36){
          this.showScan = false
          this.attendClass(code.data)
        } else {
          requestAnimationFrame(this.readQR.bind(this))
        }
      } else {
        if (this.showScan){
          requestAnimationFrame(this.readQR.bind(this))
        } 
      }
    }
    else {
      requestAnimationFrame(this.readQR.bind(this))
    }
  }

  async attendClass(code){
    const sr = this.globalService.getCode()
    const body = {srcode: sr}
    const res = await this.http.post<any>(`http://127.0.0.1:5000/attendance-api/classes/${code}`, body).toPromise();
    if (res.message == 'Class attendance has been registered'){
      const alert = await this.alertController.create({
        header: 'Congratulations',
        message: 'You have successfully attended this class!',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  stopScan(){
    this.showScan = false
  }
}
