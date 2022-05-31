import {Component, Input, OnInit} from '@angular/core';
import {filter, switchMap, tap} from "rxjs/operators";
import firebase from "firebase/compat";
import {UserStore} from "../../../../services/types";
import {Collections} from "../../../../services/crud/collections";
import {CrudService} from "../../../../services/crud/crud.service";
import {AuthService} from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-likes-modal',
  templateUrl: './likes-modal.component.html',
  styleUrls: ['./likes-modal.component.css']
})
export class LikesModalComponent implements OnInit {

  @Input()
  public likes: string[] | undefined = []

  public user: firebase.User | null = null;

  public likerList: UserStore[] = [];

  constructor(private crudService: CrudService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userFromStore: UserStore[]) => {
            userFromStore.forEach((user) => {
              this.likes?.forEach((liker) =>{
                if(user?.email == liker){
                  this.likerList?.push(user)
                }
              })
            })
          }))
      })
    ).subscribe();
  }

}
