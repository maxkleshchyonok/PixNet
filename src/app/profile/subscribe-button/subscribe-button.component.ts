import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.css']
})
export class SubscribeButtonComponent implements OnInit {

  public isFollow: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick() {
    this.isFollow = !this.isFollow
  }

}
