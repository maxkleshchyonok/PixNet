import {Component} from '@angular/core';
import {Posts} from "../Store";
import firebase from "firebase/compat/app";
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pix-project';

  // public user: firebase.User | null = null;
  //
  // constructor(private authService: AuthService,
  //             private router: Router) {
  // }
  //
  // public ngOnInit(): void {
  //   this.authService.user$.subscribe((value: firebase.User | null) => {
  //       this.user = value;
  //       console.log(value?.displayName)
  //     }
  //   )
  // }
  //
  // public login(): void {
  //   this.authService.googleSignIn().subscribe()
  // }
  //
  // public logout(): void{
  //   this.authService.signOut().subscribe(()=> this.router.navigate(["/"]))
  // }

}
