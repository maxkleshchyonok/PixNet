import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {ReplaySubject} from "rxjs";
import {UserStore} from "../../services/types";
import {Collections} from "../../services/crud/collections";
import {Observable} from "rxjs";
import {CrudService} from "../../services/crud/crud.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user$: ReplaySubject<firebase.User | null> = this.authService.user$;

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);

  public userId: string | undefined = '';

  public userEmail: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private crudService: CrudService) {
  }


  public ngOnInit() {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.userEmail = value?.email!
      this.userId = value?.uid!})
  }

  public logout(): void{
    this.authService.signOut().subscribe(()=> this.router.navigate(["/"]))
  }

}
