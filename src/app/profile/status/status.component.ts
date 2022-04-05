import {Component, Input, OnInit} from '@angular/core';
import {ProfileInfoElement} from "./status";
import {ProfileInfo} from "../../../Store";


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})

export class StatusComponent implements OnInit {

  public elements: ProfileInfoElement[] = ProfileInfo

  constructor() {
  }

  ngOnInit(): void {
  }

}
