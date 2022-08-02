import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  srcode = null;
  isStudent = null;
  name = null;
  section = null;
  constructor() { }

  setCode(code) {
    this.srcode = code;
  }

  getCode() {
    return this.srcode;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setSection(section) {
    this.section = section;
  }

  getSection() {
    return this.section;
  }

  setType(type) {
    this.isStudent = type;
  }

  getType() {
    return this.isStudent;
  }


}
