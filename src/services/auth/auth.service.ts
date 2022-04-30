import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import AuthProvider = firebase.auth.AuthProvider;
import {from, Observable, ReplaySubject} from "rxjs"
import UserCredential = firebase.auth.UserCredential;
import {CrudService} from "../crud/crud.service";
import {Collections} from "../crud/collections";
import {switchMap, tap, filter, map} from "rxjs/operators";
import {User, UserStore} from "../types";
import {collection, getFirestore, query, where} from "@angular/fire/firestore";
import {user} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: ReplaySubject<firebase.User | null> = new ReplaySubject<firebase.User | null>(1)

  public userStore: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);

  public db = getFirestore();

  public usersRef = collection(this.db, "users" );

  public q = query(this.usersRef, where("email", "==", ""))


  constructor(private afAuth: AngularFireAuth,
              private crudService: CrudService,
              ) {
    this.afAuth.authState.pipe(
      filter((value: firebase.User | null)=> !!value),
      tap((value: firebase.User | null) => this.user$.next(value)),
      switchMap((value: firebase.User | null) => {
        const user: User = {
          name: value?.displayName!,
          surname: value?.displayName!,
          email: value?.email!,

        }
        return this.crudService.createObject(Collections.USERS, user)
      })
    )
      // .subscribe((value: firebase.User | null) =>
      //   this.user$.next(value))
      .subscribe();
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
