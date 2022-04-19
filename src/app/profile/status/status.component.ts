import {Component, Input, OnInit} from '@angular/core';
import {ProfileInfoElement} from "./status";
import {ProfileInfo} from "../../../Store";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})

export class StatusComponent implements OnInit {

  public elements: ProfileInfoElement[] = ProfileInfo;

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

}
