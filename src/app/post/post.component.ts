import { Component, OnInit } from '@angular/core';
import {Posts} from "../../postsStore";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  Posts = Posts
  constructor() { }

  ngOnInit(): void {
  }

}
