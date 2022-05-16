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

  public authID: string | undefined = '';

  constructor(private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    // this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
    // console.log(this.userEmail)
    // this.authService.user$.pipe(
    //   tap((value: firebase.User | null) => this.user = value),
    //   filter((value: firebase.User | null) => !!value),
    //   switchMap(() => {
    //     return this.crudService.handleEmailData<UserStore>(Collections.USERS, '==', this.userEmail).pipe(
    //       tap((currentUser: UserStore[]) => {
    //         console.log(currentUser[0]?.following)
    //         this.friends = currentUser[0]?.following}))
    //   })
    // ).subscribe();
    // console.log(this.friends)
  }

}
