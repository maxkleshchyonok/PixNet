import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../../services/crud/crud.service";
import {AuthService} from "../../../services/auth/auth.service";
import {UserStore} from "../../../services/types";
import {Observable} from "rxjs";
import {Collections} from "../../../services/crud/collections";
import firebase from "firebase/compat";
import {filter, switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  public user: firebase.User | null = null;

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS)

  public friends: string[] | undefined = [];

  public userEmail: string = '';

  public friendsList: UserStore[] = [];

  constructor(private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
    console.log(this.userEmail)
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleEmailData<UserStore>(Collections.USERS, '==', this.userEmail).pipe(
          tap((currentUser: UserStore[]) => {
            console.log(currentUser)
            console.log(currentUser[0]?.following)
            this.friends = currentUser[0]?.following}))
      }),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((currentUser: UserStore[]) => {
            currentUser.forEach((user) => {
              this.friends?.forEach((friend) =>{
                if(user?.email == friend){
                  this.friendsList.push(user)
                }
              })
            })
          }))
      }),
    ).subscribe();
  }


}
