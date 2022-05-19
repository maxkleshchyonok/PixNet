import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {CommentControls, PostControls} from "../../models/controls.enum";
import firebase from "firebase/compat";
import {AuthService} from "../../../services/auth/auth.service";
import {Comment, CommentStore, PostStore, UserStore} from "../../../services/types";
import {Collections} from "../../../services/crud/collections";
import {CrudService} from "../../../services/crud/crud.service";
import DocumentReference = firebase.firestore.DocumentReference;
import {Observable, of} from "rxjs";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.css']
})
export class PostModalComponent implements OnInit {

  @Input()
  public image: string | null = '';
  @Input()
  public postDescr: string | null = '';
  @Input()
  public likes: number = 0;
  @Input()
  public postId: string = ''

  public userEmail: string = '';

  public userId: string = '';

  public userName: string = ''

  public commentsForm: FormGroup = new FormGroup({});

  public formControls: typeof CommentControls = CommentControls;

  public comments: Observable<CommentStore[]> = this.crudService.handleData<CommentStore>(Collections.COMMENTS);

  public userPhoto: string = ''

  constructor(private dialogRef: MatDialog,
              private authService: AuthService,
              private crudService: CrudService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
    this.commentsForm.valueChanges.subscribe(value => console.log(value));
    this.commentsForm.addControl(CommentControls.text, new FormControl("", Validators.required));
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.userEmail = value?.email!
      this.userId = value?.uid!
      this.userName = value?.displayName!
      this.userPhoto = value?.photoURL!
    });
  }

  public submitForm(): void {
    console.log('pressed')
    if (this.commentsForm.valid) {
      const comment: Comment = {
        userPhoto: this.userPhoto,
        userName: this.userName,
        text: this.commentsForm?.controls[CommentControls.text].value,
        time: new Date().getTime(),
        postId: this.postId,
        userEmail: this.userEmail
      }
      console.log(this.userEmail)
      console.log(comment)
      this.addComment(comment);
      this.commentsForm?.reset();
      this.dialogRef.closeAll()
    } else {
      alert("Error")
    }
  }

  public addComment(comment: Comment): void {
    this.crudService.createObject(Collections.COMMENTS, comment).subscribe((value: DocumentReference<Comment>) => console.log(value));
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.commentsForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

  public delete(id: string): void {
    this.crudService.deleteObject(Collections.COMMENTS, id).subscribe();
  }

  public closeDialog(): void{
    this.dialogRef.closeAll()
  }

}
