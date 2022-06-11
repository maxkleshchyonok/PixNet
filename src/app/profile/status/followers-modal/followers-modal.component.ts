import {Component, Input, OnInit} from '@angular/core';
import {filter, switchMap, tap} from "rxjs/operators";
import firebase from "firebase/compat";
import {UserStore} from "../../../../services/types";
import {Collections} from "../../../../services/crud/collections";
import {CrudService} from "../../../../services/crud/crud.service";
import {AuthService} from "../../../../services/auth/auth.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-followers-modal',
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.css']
})
export class FollowersModalComponent implements OnInit {

  @Input()
  public followers: string[] | undefined = [];

  public user: firebase.User | null = null;

  public followersList: UserStore[] = [];

  constructor(private crudService: CrudService,
              private authService: AuthService,
              private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userFromStore: UserStore[]) => {
            userFromStore.forEach((user) => {
              this.followers?.forEach((follower) =>{
                if(user?.email == follower){
                  this.followersList?.push(user)
                }
              })
            })
          }))
      })
    ).subscribe();
  }

  public closeDialog(): void{
    this.dialogRef.closeAll()
  }

}
