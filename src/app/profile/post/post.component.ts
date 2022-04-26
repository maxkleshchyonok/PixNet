import {Component, OnInit} from '@angular/core';
import {Posts} from "../../../Store";
// import {Post} from "./post";
import firebase from "firebase/compat";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {Observable} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {Post, PostStore, User} from "../../../services/types";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  public posts: Observable<PostStore[]> = this.crudService.handleData<PostStore>(Collections.POSTS);

  public isLike: boolean = false;

  constructor(private authService: AuthService, private crudService: CrudService) {
  }

  public delete(id: string): void {
    console.log(id);
    this.crudService.deleteObject(Collections.POSTS, id).subscribe();
  }

  onClick() {
    this.isLike = !this.isLike
  }

  public update(id: string): void {
    const post: Post = {
      image: "https://media.istockphoto.com/photos/melbourne-central-business-district-picture-id600688368?k=20&m=600688368&s=612x612&w=0&h=hbN7pEOSGuyzbygdh-vgj5mmBeGne2NHDYlojpfmoTw=",
      postDescr: "Visited Melbourne",
      // likeNum: 117

    }
    this.crudService.updateObject(Collections.POSTS, id, post).subscribe();
  }

  // public posts: Post[] = Posts;

}
