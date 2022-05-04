import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {PostControls, UserControls} from "../../models/controls.enum";
import {Post, PostStore, User} from "../../../services/types";
import {Collections} from "../../../services/crud/collections";
import {AuthService} from "../../../services/auth/auth.service";
import {CrudService} from "../../../services/crud/crud.service";
import DocumentReference = firebase.firestore.DocumentReference;
import firebase from "firebase/compat/app";
import {Observable} from "rxjs";
import {UploadService} from "../../../services/crud/upload.service";
import {combineLatest, takeWhile} from "rxjs";


@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {



  public posts: Observable<PostStore[]> = this.crudService.handleData<PostStore>(Collections.POSTS);

  public myForm: FormGroup = new FormGroup({});
  public formControls: typeof PostControls = PostControls;

  public imageLink: string | null = "";

  public progress: string | undefined = "";

  constructor(private dialogRef: MatDialog,
              private authService: AuthService,
              private crudService: CrudService,
              private uploadService: UploadService
  ) { }

  public ngOnInit(): void {
    this.myForm.valueChanges.subscribe(value => console.log(value));
    this.myForm.addControl(PostControls.image, new FormControl("", Validators.required));
    this.myForm.addControl(PostControls.postDescr, new FormControl("", Validators.required));
  }

  public submitForm(): void {
    if (this.myForm.valid) {
      const post: Post = {
        image: this.imageLink,
        postDescr: this.myForm?.controls[PostControls.postDescr].value,
        likes: []
      }
      console.log(post)
      this.addPost(post);
      this.myForm?.reset();
      this.dialogRef.closeAll()
    } else {
      alert("Error")
    }
  }

  public addPost(post: Post): void {
    this.crudService.createObject(Collections.POSTS, post).subscribe((value: DocumentReference<Post>) => console.log(value));
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.myForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

  public closeDialog(): void{
    this.dialogRef.closeAll()
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
