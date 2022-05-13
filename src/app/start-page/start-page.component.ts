import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {CrudService} from "../../services/crud/crud.service";
import {switchMap, tap} from "rxjs/operators";
import {Collections} from "../../services/crud/collections";
import {Subscription} from "rxjs";
import {UserStore} from "../../services/types";
import {Observable} from "rxjs";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  public user: firebase.User | null = null;

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);

  private subscriptions: Array<Subscription> = []

  public userEmail: string = '';


  constructor(private authService: AuthService,
              private router: Router,
              private crudService: CrudService) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
    this.authService.user$.subscribe((value: firebase.User | null) => {
        this.user = value;
        console.log(value?.displayName)
        console.log(this.userEmail)
      }
    )


  }

  // ngOnInit(): void {
  //   this.authService.user$.pipe(
  //     tap((value: firebase.User | null) => this.user = value),
  //     switchMap((user) => this.crudService.createObject(Collections.USERS, user))
  //   ).subscribe()
  // }

  public login(): void {
    this.authService.googleSignIn().subscribe()
  }


  // public logout(): void{
  //   this.authService.signOut().subscribe(()=> this.router.navigate(["/"]))
  // }

}
