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

  public isFollow: boolean | undefined = false;

  public userId: string | undefined = '';

  public userName: string | undefined = '';

  public userPhoto: string | undefined = '';

  public userID: string = '';

  public currentUser: UserStore[] | undefined;

  public userEmail: string = '';

  public authID: string | undefined = '';

  public testId: string = 'vxlmLsJM29x23oqyYD4n';

  public testUserEmail: string = 'maximilianthefirstlegendary@gmail.com';

  constructor(private authService: AuthService,
              private router: Router,
              private crudService: CrudService,
              public activatedRoute: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userId = value?.uid!)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)

    // if(this.userEmail ===  this.user?.email)

    console.log(this.userId + ' айди моё')
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleIdData<UserStore>(Collections.USERS, '==', this.userID).pipe(
          tap((userFromStore: UserStore[]) => {
            this.isFollow = userFromStore[0]?.followers.includes(this.user?.uid!);
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

  public updateFollowers(id: string) {
    this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
      map((userFromStore: UserStore | undefined) => {
        const userIndex = userFromStore?.followers.indexOf(this.user?.uid!);
        if (userIndex === -1) {
          return {
            followers: userFromStore?.followers.concat(this.user?.uid!),
          }
        } else {
          const newArr: string[] | undefined = userFromStore?.followers.splice(userIndex!, 1);
          return {
            followers: userFromStore?.followers,
          }
        }
      }),
      switchMap(newFollowers => this.crudService.updateObject(Collections.USERS, id, {...newFollowers})
      )).subscribe()
  }


  // public updateFollowing(id: string) {
  //   this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
  //     map((currentUserFromStore: UserStore | undefined) => {
  //       const followingInd = currentUserFromStore?.following.indexOf(this.userID);
  //       console.log(this.authID + 'это аус айди')
  //       if (followingInd == -1) {
  //         return {
  //           following: currentUserFromStore?.following.concat(this.userID),
  //         }
  //       } else {
  //         const newArray: string[] | undefined = currentUserFromStore?.following.splice(followingInd!, 1)
  //         return {
  //           following: currentUserFromStore?.following
  //         }
  //       }
  //     }),
  //     switchMap(newFollowing => this.crudService.updateObject(Collections.USERS, id, {...newFollowing}))
  //   ).subscribe()
  // }


  public updateFollowing(id: string) {
    console.log(id + 'это имейл')
    this.crudService.getUserDoc<UserStore>(Collections.USERS, id).pipe(
      map((userFromStore: UserStore | undefined) => {

        const userIndex = userFromStore?.following.indexOf(this.userId!);
        if (userIndex === -1) {
          return {
            following: userFromStore?.following.concat(this.userId!),
          }
        } else {
          const newArr: string[] | undefined = userFromStore?.following.splice(userIndex!, 1);
          return {
            following: userFromStore?.following,
          }
        }
      }),
      switchMap(newFollowing => this.crudService.updateObject(Collections.USERS, id, {...newFollowing})
      )).subscribe()
  }



}
