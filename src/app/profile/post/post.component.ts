import {Component, OnInit} from '@angular/core';
import {Posts} from "../../../Store";
import {Post} from "./post";
import firebase from "firebase/compat";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {Observable} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

  public posts: Observable<Post[]> = this.crudService.handleData<Post>(Collections.POSTS);

  constructor(private authService: AuthService, private crudService: CrudService) {
  }

  // public posts: Post[] = Posts;

}
