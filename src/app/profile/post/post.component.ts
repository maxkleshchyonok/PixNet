import {Component, OnInit} from '@angular/core';
import {Posts} from "../../../Store";
import {Post} from "./post";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  public posts: Post[] = Posts;

  constructor() {
  }

  ngOnInit(): void {
  }

}
