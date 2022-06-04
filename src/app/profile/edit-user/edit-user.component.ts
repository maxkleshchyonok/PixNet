import {Component, OnInit} from '@angular/core';
import {EditUserControls, PostControls} from "../../models/controls.enum";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import firebase from "firebase/compat";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth/auth.service";
import {CrudService} from "../../../services/crud/crud.service";
import {UploadService} from "../../../services/crud/upload.service";
import {Post, User, UserStore} from "../../../services/types";
import {Collections} from "../../../services/crud/collections";
import {combineLatest, takeWhile} from "rxjs";
import DocumentReference = firebase.firestore.DocumentReference;
import {filter, switchMap, tap} from "rxjs/operators";
import {Observable} from "rxjs";


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public user: firebase.User | null = null;

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);

  public myForm: FormGroup = new FormGroup({});

  public formControls: typeof EditUserControls = EditUserControls;

  public userEmail: string | undefined = '';

  public imageLink: string | null | undefined = "";

  public progress: string | undefined = "";

  public userId: string = '';

  public followers: string[] | undefined = [];

  public following: string[] | undefined = [];

  public name: string | undefined = '';

  public userID: string | undefined = '';

  public defaultImage: string | undefined = '';

  constructor(private dialogRef: MatDialog,
              private authService: AuthService,
              private crudService: CrudService,
              private uploadService: UploadService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userId = value?.uid!)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)

    this.myForm.valueChanges.subscribe(value => console.log(value));
    this.myForm.addControl(PostControls.image, new FormControl("", Validators.required));
    this.myForm.addControl(EditUserControls.status, new FormControl("", Validators.required));
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!);
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userFromStore: UserStore[]) => {
            console.log(userFromStore)
            userFromStore.forEach((user) => {
              if (user?.email == this.userEmail) {
                this.followers = user?.followers;
                this.following = user?.following;
                this.name = user?.name;
                this.userID = user?.userID;
                this.defaultImage = user?.img;
              }
            })
          }))
      }),
    ).subscribe();
    console.log(this.name)
  }

  public submitForm(id: string): void {
    this.update(id)
  }

  public update(id: string): void {
    console.log(this.following)
    const user: User = {
      userID: this.userId,
      name: this.name,
      img: this.imageLink!,
      status: this.myForm?.controls[EditUserControls.status].value,
      followers: this.followers,
      following: this.following,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public onFileSelected(event: Event): void {
    if (event) {
      const eventTarget = (<HTMLInputElement>event?.target);
      if (eventTarget && eventTarget.files) {
        const file: File = eventTarget.files[0];
        combineLatest(this.uploadService.uploadFileAndGetMetadata('test', file))
          .pipe(
            takeWhile(([, link]) => {
              return !link;
            }, true),
          )
          .subscribe(([percent, link]) => {
            this.progress = percent;
            this.imageLink = link;

          });
      }
    }
  }

}
