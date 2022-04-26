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

  constructor() {
  }

}
