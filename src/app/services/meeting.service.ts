import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Meeting} from "../models/Meeting";
import { Observable, map } from 'rxjs';
import * as xml2js from 'xml2js'; 

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(private http : HttpClient) { }

  createMeeting(meeting : Meeting, hash: string) : Observable<any> {
    return this.http.get(`/bigbluebutton/api/create?meetingID=${meeting.meetingID}&checksum=${hash}&name=${meeting.name}`,
      { responseType: 'text' }).pipe(
        map(xml => {
          let resJs = this.parseXml(xml)
          return resJs
        })
      );
  }

  public parseXml(xml: string) {
    let resJs = {}
    xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        let keys = Object.keys(result.response)
        for (const key of keys) {
          let tmpJs: any = {}
          tmpJs[key] = result.response[key][0]
          resJs = {...resJs, ...tmpJs}
        }
      }
    });
    return resJs
  }

}
