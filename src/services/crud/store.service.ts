import { Injectable } from '@angular/core';
import {UserStore} from "../types";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _user: UserStore;

  public user$: BehaviorSubject<UserStore> = new BehaviorSubject<UserStore>(null);

  get user(): UserStore {
    return this._user;
  }

  set user(value: UserStore) {
    this._user = value;
    this.user$.next(value);
  }

  constructor() {
    this._user = null;
  }
}
