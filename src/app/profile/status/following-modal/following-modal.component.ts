import {Component, Input, OnInit} from '@angular/core';
import {UserStore} from "../../../../services/types";
import {CrudService} from "../../../../services/crud/crud.service";
import {AuthService} from "../../../../services/auth/auth.service";
import {filter, switchMap, tap} from "rxjs/operators";
import firebase from "firebase/compat";
import {Collections} from "../../../../services/crud/collections";

@Component({
  selector: 'app-following-modal',
  templateUrl: './following-modal.component.html',
  styleUrls: ['./following-modal.component.css']
})
export class FollowingModalComponent implements OnInit {

  @Input()
  public following: string[] | undefined = [];

  public user: firebase.User | null = null;

  public followingList: UserStore[] = [];

  constructor(private crudService: CrudService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userFromStore: UserStore[]) => {
            userFromStore.forEach((user) => {
              this.following?.forEach((following) =>{
                if(user?.email == following){
                  this.followingList?.push(user)
                }
              })
            })
          }))
      })
    ).subscribe();
  }

}
