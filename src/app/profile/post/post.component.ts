import {Component, Input, OnInit} from '@angular/core';
import {Posts} from "../../../Store";
// import {Post} from "./post";
import firebase from "firebase/compat";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {Observable} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {Post, PostStore, User, UserStore} from "../../../services/types";
import {filter, map, switchMap} from "rxjs/operators";
import Firestore = firebase.firestore.Firestore;
import {PopUpComponent} from "../pop-up/pop-up.component";
import {MatDialog} from "@angular/material/dialog";
import {PostModalComponent} from "../post-modal/post-modal.component";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  public posts: Observable<PostStore[]> = this.crudService.handleData<PostStore>(Collections.POSTS);

  public isLike: boolean = false;

  constructor(private authService: AuthService,
              private crudService: CrudService,
              private dialogRef: MatDialog) {
  }

  public delete(id: string): void {
    console.log(id);
    this.crudService.deleteObject(Collections.POSTS, id).subscribe();
  }

  // onClick() {
  //   this.isLike = !this.isLike
  // }

  public update(id: string): void {
    const post: Post = {
      image: "https://media.istockphoto.com/photos/melbourne-central-business-district-picture-id600688368?k=20&m=600688368&s=612x612&w=0&h=hbN7pEOSGuyzbygdh-vgj5mmBeGne2NHDYlojpfmoTw=",
      postDescr: "Visited Melbourne",
      likes: [],
      // isLiked: false
    }
    this.crudService.updateObject(Collections.POSTS, id, post).subscribe();
  }

  // public posts: Post[] = Posts;

  public updateLikes(id: string): any {
    console.log(id)
    this.authService.user$.pipe(
      filter((value: firebase.User | null) => !!value),
      switchMap((value: firebase.User | null) => {
        return this.crudService.getUserDoc<PostStore>(Collections.POSTS, id).pipe(
          map((post) => {
            const userIndex = post?.likes.indexOf(value?.uid!);
            console.log(userIndex);
            if (userIndex === -1) {
              this.isLike = true;
              return post?.likes.concat(value?.uid!)
            } else {
              const newArr: any = post?.likes.splice(userIndex! ,1);
              this.isLike = false;
              console.log(newArr)
              return post?.likes;
            }
          }),
          switchMap(likes => this.crudService.updateObject(Collections.POSTS, id, {likes})
          )
        )
      })
    ).subscribe();
  }

  public openPostModal(): void{
    this.dialogRef.open(PostModalComponent)
  }

}


