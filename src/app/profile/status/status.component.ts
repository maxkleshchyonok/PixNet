import {Component, Input, OnInit} from '@angular/core';

export interface ProfileInfoElement {
  avatar: string
  userName: string
  status: string
  friendsNum: number
  postsNum: number
}

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  @Input()
  elements: ProfileInfoElement[] = []

  constructor() {
  }

  ngOnInit(): void {
  }

}
