import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {ReplaySubject} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user$: ReplaySubject<firebase.User | null> = this.authService.user$;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  // public ngOnInit(): void {
  //   this.authService.user$.subscribe((value: firebase.User | null) => {
  //       this.user = value;
  //       console.log(value?.displayName)
  //     }
  //   )
  // }



  public ngOnInit() {
  }

  public logout(): void{
    this.authService.signOut().subscribe(()=> this.router.navigate(["/"]))
  }

}
