import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../../services/crud/crud.service";
import {AuthService} from "../../../services/auth/auth.service";
import {UserStore} from "../../../services/types";
import {Observable} from "rxjs";
import {Collections} from "../../../services/crud/collections";
import firebase from "firebase/compat";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS)

  public fireUsers: Observable<UserStore[]> | undefined;

  constructor(private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {

  }

}
