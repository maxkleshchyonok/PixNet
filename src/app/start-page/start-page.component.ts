import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  public user: firebase.User | null = null;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
        this.user = value;
        console.log(value?.displayName)
      }
    )
  }

  public login(): void {
    this.authService.googleSignIn().subscribe()
  }

  // public logout(): void{
  //   this.authService.signOut().subscribe(()=> this.router.navigate(["/"]))
  // }

}
