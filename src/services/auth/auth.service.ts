import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import AuthProvider = firebase.auth.AuthProvider;
import {from, Observable, ReplaySubject} from "rxjs"
import UserCredential = firebase.auth.UserCredential;
import {CrudService} from "../crud/crud.service";
import {Collections} from "../crud/collections";
import {switchMap, tap, filter, map} from "rxjs/operators";
import {User} from "../types";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: ReplaySubject<firebase.User | null> = new ReplaySubject<firebase.User | null>(1)

  constructor(private afAuth: AngularFireAuth,
              private crudService: CrudService) {
    this.afAuth.authState.pipe(
      tap((value: firebase.User | null) => this.user$.next(value)),
      filter((value: firebase.User | null) => !!value),
      switchMap((userFromLogin: firebase.User | null) => {
        return this.crudService.handleMailData(Collections.USERS, userFromLogin?.email!).pipe(
          map(userFromStore => {
            if (userFromStore.length !== 0) {
              return null;
            } else {
              const user: User = {
                email: userFromLogin?.email!,
                name: userFromLogin?.displayName!,
                img: userFromLogin?.photoURL!,
                userID: userFromLogin?.uid!,
                followers: [],
                following: []
              }
              return user;
            }
          }),
          filter((value: User | null) => !!value),
          switchMap(newUser => this.crudService.createObject(Collections.USERS, newUser)))
      })).subscribe()
  }


  public googleSignIn(): Observable<UserCredential> {
    return this.authWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  public signOut(): Observable<void> {
    return from(this.afAuth.signOut())
  }

  public authWithPopup(provider: AuthProvider): Observable<UserCredential> {
    return from(this.afAuth.signInWithPopup(provider));
  }

}
