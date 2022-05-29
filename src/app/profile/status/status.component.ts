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
import {MatDialog} from "@angular/material/dialog";
import {EditUserComponent} from "../edit-user/edit-user.component";


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

  public isFollow: boolean | undefined = false;

  public userId: string | undefined = '';

  public userName: string | undefined = '';

  public userPhoto: string | undefined = '';

  public userID: string = '';

  public currentUser: UserStore[] | undefined;

  public userEmail: string = '';

  public authID: string | undefined = '';

  public userOnScreen: string | null = this.activatedRoute.snapshot.paramMap.get('id');

  public userOnScreenEmail: string | undefined = '';


  constructor(private authService: AuthService,
              private router: Router,
              private crudService: CrudService,
              public activatedRoute: ActivatedRoute,
              private dialogRef: MatDialog) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userId = value?.uid!)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)

    console.log(this.userId + ' айди моё')
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleIdData<UserStore>(Collections.USERS, '==', this.userID).pipe(
          tap((userFromStore: UserStore[]) => {
            this.isFollow = userFromStore[0]?.followers?.includes(this.user?.uid!);
          }))
      }),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userFromStore: UserStore[]) => {
            userFromStore.forEach((user) => {
              if(user?.id == this.userOnScreen){
                this.userOnScreenEmail = user?.email
              }
            })
          }))
      }),
      switchMap(() => {
        return this.crudService.handleEmailData<UserStore>(Collections.USERS, '==', this.userEmail).pipe(
          tap((currentUser: UserStore[]) => {
            console.log(currentUser[0]?.id)
            this.authID = currentUser[0]?.id}))
      })
    ).subscribe();



  }

  public updateFollowers(id: string) {
    this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
      map((userFromStore: UserStore | undefined) => {
        const userIndex = userFromStore?.followers?.indexOf(this.user?.uid!);
        if (userIndex === -1) {
          return {
            followers: userFromStore?.followers?.concat(this.user?.uid!),
          }
        } else {
          const newArr: string[] | undefined = userFromStore?.followers?.splice(userIndex!, 1);
          return {
            followers: userFromStore?.followers,
          }
        }
      }),
      switchMap(newFollowers => this.crudService.updateObject(Collections.USERS, id, {...newFollowers})
      )).subscribe()
  }

  public updateFollowing(id: string) {
    console.log(id + 'это айди меня')
    this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
      map((userFromStore: UserStore | undefined) => {

        const userIndex = userFromStore?.following?.indexOf(this.userOnScreenEmail!);
        if (userIndex === -1) {
          return {
            following: userFromStore?.following?.concat(this.userOnScreenEmail!),
          }
        } else {
          const newArr: string[] | undefined = userFromStore?.following?.splice(userIndex!, 1);
          return {
            following: userFromStore?.following,
          }
        }
      }),
      switchMap(newFollowing => this.crudService.updateObject(Collections.USERS, id, {...newFollowing})
      )).subscribe()
  }

  public openDialog(): void{
    this.dialogRef.open(EditUserComponent)
  }

}
