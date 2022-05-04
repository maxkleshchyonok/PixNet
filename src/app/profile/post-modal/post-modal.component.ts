import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit {



  constructor(private dialogRef: MatDialog) { }

  ngOnInit(): void {
  }

  public closeDialog(): void{
    this.dialogRef.closeAll()
  }

}
