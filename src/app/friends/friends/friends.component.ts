// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-friends',
//   templateUrl: './friends.component.html',
//   styleUrls: ['./friends.component.css']
// })
// export class FriendsComponent implements OnInit {
//
//   public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);
//
//   constructor(private authService: AuthService, private crudService: CrudService) { }
//
//
//
//   ngOnInit(): void {
//   }
//
// }

import {Component, OnInit} from '@angular/core';
import firebase from "firebase/compat/app";
import {Observable} from "rxjs";
import DocumentReference = firebase.firestore.DocumentReference;
import {Collections} from "../../../services/crud/collections";
import {AuthService} from "../../../services/auth/auth.service";
import {CrudService} from "../../../services/crud/crud.service";
import {User, UserStore} from "../../../services/types";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserControls} from "../../models/controls.enum";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit{

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);
  public myForm: FormGroup = new FormGroup({});
  public formControls: typeof UserControls = UserControls;

  constructor(private authService: AuthService, private crudService: CrudService) {
  }

  public ngOnInit(): void {
    this.myForm.valueChanges.subscribe(value => console.log(value));
    this.myForm.addControl(UserControls.name, new FormControl("", Validators.required));
    this.myForm.addControl(UserControls.surname, new FormControl("Test", Validators.required));
    this.myForm.addControl(UserControls.email, new FormControl("", Validators.compose([Validators.required, Validators.email])));
  }

  public submitForm(): void {
    if (this.myForm.valid) {
      const user: User = {
        name: this.myForm?.controls[UserControls.name].value,
        surname: this.myForm?.controls[UserControls.surname].value,
        email: this.myForm?.controls[UserControls.email].value
      }
      this.addUser(user);
      this.myForm?.reset();
    } else {
      alert("Error")
    }
  }

  // public addUser(): void {
  //   const user: User = {
  //     name: "nameOnemore",
  //     surname: "surname",
  //   }
  //   this.crudService.createObject(Collections.USERS, user).subscribe((value: DocumentReference<User>) => console.log(value));
  // }

  public addUser(user: User): void {
    this.crudService.createObject(Collections.USERS, user).subscribe((value: DocumentReference<User>) => console.log(value));
  }

  public getInfo(id: string): void {
    this.crudService.getUserDoc<User>(Collections.USERS, id).subscribe(((user: User | undefined) => {
          if (user) {
            this.myForm.controls[this.formControls.name].setValue(user.name);
            this.myForm.controls[this.formControls.surname].setValue(user.surname);
            this.myForm.controls[this.formControls.email].setValue(user.email);
          }
        }
      )
    );
  }

  public delete(id: string): void {
    this.crudService.deleteObject(Collections.USERS, id).subscribe();
  }

  public update(id: string): void {
    const user: User = {
      name: "newname",
      surname: "newsurname",
      email: "newemail"
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.myForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

}
