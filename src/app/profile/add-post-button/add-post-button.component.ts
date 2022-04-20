import {Component} from '@angular/core';
import firebase from "firebase/compat";
import {Post, PostStore} from "../../../services/types";
import {Collections} from "../../../services/crud/collections";
import {AuthService} from "../../../services/auth/auth.service";
import {CrudService} from "../../../services/crud/crud.service";
import {Observable} from "rxjs";
import DocumentReference = firebase.firestore.DocumentReference;

@Component({
  selector: 'app-add-post-button',
  templateUrl: './add-post-button.component.html',
  styleUrls: ['./add-post-button.component.css']
})
export class AddPostButtonComponent {

  public posts: Observable<PostStore[]> = this.crudService.handleData<PostStore>(Collections.POSTS);

  constructor(private authService: AuthService, private crudService: CrudService) {
  }

  public addPost(): void {
    const post: Post = {
     image:"https://www.amadriapark.com/wp-content/uploads/sites/5/2018/08/ap-excursion-Venice.jpg", postDescr:"Holiday in Venice", likeNum: 116
  }
    this.crudService.createObject(Collections.POSTS, post).subscribe((value: DocumentReference<Post>) => console.log(value));
  }
}

