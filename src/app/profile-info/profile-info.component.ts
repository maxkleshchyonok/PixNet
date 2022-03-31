import { Component, OnInit } from '@angular/core';
import {StatusElement} from "../status/status.component";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {

  public status=''

  statusElements: StatusElement[] = [
    {status:``}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
