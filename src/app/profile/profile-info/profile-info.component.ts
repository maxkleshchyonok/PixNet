import {Component, OnInit} from '@angular/core';
import {ProfileInfoElement} from "../status/status.component";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {

  // public status: string = ''
  // public friendsNum: number

  profileInfoElements: ProfileInfoElement[] = [
    {
      avatar: 'https://www.upskillist.com/assets/course-cards/website/wide/photography-21.png',
      userName: 'Max Kleshchyonok',
      status: `Follow me!`,
      friendsNum: 3,
      postsNum: 4
    }
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

}
