import {Component, Input, OnInit} from '@angular/core';

export interface StatusElement{
  status:string
}

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  @Input()
  elements: StatusElement[]=[]
  constructor() { }

  ngOnInit(): void {
  }

}
