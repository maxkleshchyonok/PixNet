import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {UserStore} from "../../../services/types";
import {of} from "rxjs";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {ReplaySubject} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);

  public name: ReplaySubject<string> = new ReplaySubject<string>(1);

  isResults: boolean = false;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.users = this.name.pipe(
      switchMap((value: string) => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          map((users: UserStore[]) => {
            return users.filter((i: UserStore) => {
              return i?.name.trim().toLowerCase().includes(value)
            })
          })
        )
      })
    )
  }

  public showResult(event: any){
    this.isResults = event.target.value !== '';
    this.name.next(event.target.value.trim().toLowerCase())
  }

}
