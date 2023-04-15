import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {MeetingService} from './services/meeting.service'
import { Meeting } from './models/Meeting';
import { map, tap } from 'rxjs';
import * as crypto from "crypto-js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  meetingForm! : FormGroup
  dataMeeting: any
  toastMessage? : {message: string, status: boolean}

  constructor(private modalService: NgbModal, private formBuilder : FormBuilder, private meetingService: MeetingService) {
  }

  ngOnInit(): void {
    this.meetingForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      meetingID: [null, [Validators.required]],
      welcome: [null],
      dialNumber: [null]
    });
  }  

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public createMeeting() {
    let shareSecret = "8cd8ef52e8e101574e400365b55e11a6"
    let meeting: Meeting = this.meetingForm.value
    const myString = `createmeetingID=${meeting.meetingID}&name=${meeting.name + shareSecret}`;
    const hash = crypto.SHA1(myString).toString();
    console.log(hash);
    this.meetingService.createMeeting(meeting, hash)
    .subscribe(data => {
      console.log(data)
      if(data.returncode === "FAILED") {
        this.toastMessage!.message = data.message
        this.toastMessage!.status = false
      } else {
        this.dataMeeting = data
      }
    });
  }

  
}

