import {Component, OnInit} from '@angular/core';
import {EditUserControls, PostControls} from "../../models/controls.enum";
import {FormControl, FormGroup, Validators, AbstractControl} from "@angular/forms";
import firebase from "firebase/compat";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth/auth.service";
import {CrudService} from "../../../services/crud/crud.service";
import {UploadService} from "../../../services/crud/upload.service";
import {Post, PostStore, User, UserStore} from "../../../services/types";
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

  public blocked: string[] | undefined = [];

  public name: string | undefined = '';

  public userID: string | undefined = '';

  public defaultImage: string | undefined = '';

  public testName: string = "maximM";

  public userOnScreenId: string = '';

  constructor(private dialogRef: MatDialog,
              private authService: AuthService,
              private crudService: CrudService,
              private uploadService: UploadService,
              ) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) =>{
      this.userId = value?.uid!;
      this.userEmail = value?.email!;
    })

    this.myForm.valueChanges.subscribe(value => {
      console.log(value)
    });
    console.log(this.name)
    this.myForm.addControl(PostControls.image, new FormControl(""));
    this.myForm.addControl(EditUserControls.status, new FormControl('', Validators.maxLength(140)));
    this.myForm.addControl(EditUserControls.name, new FormControl('',
      Validators.compose( [Validators.maxLength(35)])))
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!);
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userFromStore: UserStore[]) => {
            console.log(userFromStore)
            userFromStore.forEach((user) => {
              this.userOnScreenId = user?.id!;
              if (user?.email == this.userEmail) {
                this.followers = user?.followers;
                this.following = user?.following;
                this.blocked = user?.blocked;
                this.name = user?.name;
                this.userID = user?.userID;
                this.defaultImage = user?.image;
                console.log(this.name)
              }
            })
          }
          ))
      }),
    ).subscribe();
    console.log(this.name)
  }



  public submitForm(id: string, name: string | undefined, status: string | undefined, image: string | undefined): void {
    if (this.myForm.valid) {
      // this.update(id)

      if (this.myForm.controls[EditUserControls.image].value == '' && this.myForm.controls[EditUserControls.status].value == ''){
        this.updateImageStatus(image, id, status)
      }
      if(this.myForm.controls[EditUserControls.name].value == '' && this.myForm.controls[EditUserControls.image].value == ''){
        this.updateNameImage(name, id, image)
      }
      if(this.myForm.controls[EditUserControls.status].value == '' && this.myForm.controls[EditUserControls.name].value == ''){
        this.updateStatusName(status, id, name)
      }
      if (this.myForm.controls[EditUserControls.name].value != '' &&
        this.myForm.controls[EditUserControls.status].value != ''){
        this.updateEmptyImage(image, id)
      }
      if (this.myForm.controls[EditUserControls.image].value != '' && this.myForm.controls[EditUserControls.status].value != ''){
        this.updateEmptyName(name, id)
      }
      if (this.myForm.controls[EditUserControls.name].value != '' && this.myForm.controls[EditUserControls.image].value != ''){
        this.updateEmptyStatus(status, id)
      }
      if(this.myForm.controls[EditUserControls.name].value != '' &&
        this.myForm.controls[EditUserControls.image].value != '' &&
        this.myForm.controls[EditUserControls.status].value != ''){
        this.updateAll(id)
      }
      if(this.myForm.controls[EditUserControls.name].value == '' &&
        this.myForm.controls[EditUserControls.image].value == '' &&
        this.myForm.controls[EditUserControls.status].value == ''){
        this.updateAllEmpty(image, name, status, id)
      }
    }
    this.closeDialog()
  }

  public update(id: string): void {
    console.log(this.following)
    const user: User = {
      userID: this.userId,
      // name: this.name,
      name: this.myForm?.controls[EditUserControls.name].value,
      image: this.imageLink!,
      status: this.myForm?.controls[EditUserControls.status].value,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateAll(id: string): void {
    const user: User = {
      userID: this.userId,
      name: this.myForm?.controls[EditUserControls.name].value,
      image: this.imageLink!,
      status: this.myForm?.controls[EditUserControls.status].value,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateAllEmpty(image: string | undefined, name: string | undefined, status: string | undefined, id: string): void {
    const user: User = {
      userID: this.userId,
      name: name,
      image: image!,
      status: status!,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateNameImage(name: string | undefined, id: string, image: string | undefined): void {
    const user: User = {
      userID: this.userId,
      name: name,
      image: image!,
      status: this.myForm?.controls[EditUserControls.status].value,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateImageStatus(image: string | undefined, id: string, status: string | undefined): void {
    const user: User = {
      userID: this.userId,
      name: this.myForm?.controls[EditUserControls.name].value,
      image: image!,
      status: status!,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateStatusName(status: string | undefined, id: string, name: string | undefined): void {
    const user: User = {
      userID: this.userId,
      name: name,
      image: this.imageLink!,
      status: status!,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateEmptyImage(image: string | undefined, id: string): void {
    console.log(id)
    const user: User = {
      userID: this.userId,
      // name: this.name,
      name: this.myForm?.controls[EditUserControls.name].value,
      image: image!,
      status: this.myForm?.controls[EditUserControls.status].value,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateEmptyName(name: string | undefined, id: string): void {
    const user: User = {
      userID: this.userId,
      name: name,
      image: this.imageLink!,
      status: this.myForm?.controls[EditUserControls.status].value,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public updateEmptyStatus(status: string | undefined, id: string): void {
    const user: User = {
      userID: this.userId,
      name: this.myForm?.controls[EditUserControls.name].value,
      image: this.imageLink!,
      status: status!,
      followers: this.followers,
      following: this.following,
      blocked: this.blocked,
      email: this?.userEmail!,
    }
    this.crudService.updateObject(Collections.USERS, id, user).subscribe();
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.myForm?.controls[controlName];
    if (control) {
      if (control.value && control.value.match(/^[ ]+$/)) {
        control.setValue(control.value.trim());
      }
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
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

  public closeDialog(): void {
    this.dialogRef.closeAll();
  }

}
