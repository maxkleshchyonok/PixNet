import {Component, Input, OnInit} from '@angular/core';
import {ProfileInfoElement} from "./status";
import {ProfileInfo} from "../../../Store";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {Collections} from "../../../services/crud/collections";
import {CrudService} from "../../../services/crud/crud.service";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {PostStore, UserStore} from "../../../services/types";


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})

export class StatusComponent implements OnInit {

  public elements: ProfileInfoElement[] = ProfileInfo;

  public user: firebase.User | null = null;
  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS)

  public username: string = '';

  public isFollow: boolean = false;

  public userId: string | undefined = '';

  public userName: string | undefined = '';

  public userPhoto: string | undefined = '';

  public userFromStoreId: string = '';

  public userID: string = '';

  public firestoreID: string = '';

  public currentUser: UserStore[] | undefined;

  public userEmail: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private crudService: CrudService,
              public activatedRoute: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userId = value?.uid!)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)

    console.log(this.userId + ' айди моё')
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap((value: firebase.User | null) => {
        return this.crudService.getUserDoc<UserStore>(Collections.USERS, this.firestoreID).pipe(
          tap((modifiedUser: UserStore | undefined) => {
            this.isFollow = !!(modifiedUser?.followers.includes(value?.uid!));
          }))
      }),
      switchMap((currentUser: UserStore | undefined) => {
        return this.crudService.handleIdData<UserStore>(Collections.USERS, '==', this.user?.uid!).pipe(
          tap((user: UserStore[] | undefined) => {
            this.currentUser = user;
          })
        )
      })
    ).subscribe();
  }


  // public updateFollowers(id: string): any {
  //   console.log(id)
  //   this.authService.user$.pipe(
  //     filter((value: firebase.User | null) => !!value),
  //     switchMap((value: firebase.User | null) => {
  //       return this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
  //         map((user) => {
  //           const userIndex = user?.followers.indexOf(value?.uid!);
  //           console.log(user)
  //           console.log(userIndex);
  //           if (userIndex === -1) {
  //             this.isFollow = true;
  //             return user?.followers.concat(value?.uid!)
  //           } else {
  //             const newArr: any = user?.followers.splice(userIndex!, 1);
  //             this.isFollow = false;
  //             return user?.followers;
  //           }
  //         }),
  //         switchMap(followers => this.crudService.updateObject(Collections.USERS, id, {followers})
  //         )
  //       )
  //     })
  //   ).subscribe();
  // }

  public updateFollowers(id: string): any {
    console.log(id)
    this.authService.user$.pipe(
      filter((value: firebase.User | null) => !!value),
      switchMap((value: firebase.User | null) => {
        return this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
          map((user) => {
            const userIndex = user?.followers.indexOf(value?.uid!);
            console.log(user)
            console.log(userIndex);
            if (userIndex === -1) {
              this.isFollow = true;
              return user?.followers.concat(value?.uid!)
            } else {
              const newArr: any = user?.followers.splice(userIndex!, 1);
              this.isFollow = false;
              return user?.followers;
            }
          }),
          switchMap(followers => this.crudService.updateObject(Collections.USERS, id, {followers})
          )
        )
      })
    ).subscribe();
  }

}
