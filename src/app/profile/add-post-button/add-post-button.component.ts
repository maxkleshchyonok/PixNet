import {Component, OnInit} from '@angular/core';
import firebase from "firebase/compat";
import {Post, PostStore, UserStore} from "../../../services/types";
import {Collections} from "../../../services/crud/collections";
import {AuthService} from "../../../services/auth/auth.service";
import {CrudService} from "../../../services/crud/crud.service";
import {Observable} from "rxjs";
import DocumentReference = firebase.firestore.DocumentReference;
import {MatDialog} from "@angular/material/dialog";
import {PopUpComponent} from "../pop-up/pop-up.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-add-post-button',
  templateUrl: './add-post-button.component.html',
  styleUrls: ['./add-post-button.component.css']
})
export class AddPostButtonComponent implements OnInit{

  public posts: Observable<PostStore[]> = this.crudService.handleData<PostStore>(Collections.POSTS);
  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS)

  public userEmail: string = '';

  constructor(private authService: AuthService,
              private crudService: CrudService,
              private dialogRef: MatDialog,
              public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
  }

  // public addPost(): void {
  //   const post: Post = {
  //     image: "https://www.amadriapark.com/wp-content/uploads/sites/5/2018/08/ap-excursion-Venice.jpg",
  //     postDescr: "Holiday in Venice",
  //     likes: [],
  //     creator: '',
  //     // id:''
  //   }
  //   this.crudService.createObject(Collections.POSTS, post).subscribe((value: DocumentReference<Post>) => console.log(value));
  // }

  public openDialog(): void{
    this.dialogRef.open(PopUpComponent)
  }


}


