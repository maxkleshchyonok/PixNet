import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
// import {Post} from "./post";
import firebase from "firebase/compat";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {Post, PostStore, UserStore} from "../../../services/types";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {PostModalComponent} from "../post-modal/post-modal.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{

  @Input()
  public postImg: string | null = '';
  @Input()
  public postID: string = '';
  @Input()
  public postDescr: string | null = '';

  public user: firebase.User | null = null;

  public posts: Observable<PostStore[]> = this.crudService.handleData<PostStore>(Collections.POSTS);

  public users: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collections.USERS);

  private subscriptions: Array<Subscription> = []

  public showingUserEmail: string = '';

  public isLike: boolean = false;

  public userId: string | undefined = '';

  public userEmail: string = '';

  public postsOnScreen: PostStore[] = [];

  public userOnScreenEmail: string | undefined = ''


  constructor(private authService: AuthService,
              private crudService: CrudService,
              private dialogRef: MatDialog,
              public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log(this.postDescr)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userId = value?.uid!)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
    console.log(this.userEmail)
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS,).pipe(
          tap((currentUser: UserStore[]) => {
            console.log(currentUser)
            currentUser.forEach( (user) => {
              if(user?.id == this.activatedRoute.snapshot.paramMap.get('id')){
                this.userOnScreenEmail = user?.email
              }
            } )
          }))
      }),
      switchMap(() => {
        return this.crudService.handleCreatorData<PostStore>(Collections.POSTS, '==', this.userOnScreenEmail!).pipe(
          tap((currentPosts: PostStore[]) => {
            console.log(currentPosts)
              this.postsOnScreen = currentPosts
            })
        )
      })
    ).subscribe();
  }

  public delete(id: string): void {
    console.log(id);
    this.crudService.deleteObject(Collections.POSTS, id).subscribe();
  }

  public change() {
    this.isLike = !this.isLike
  }

  public update(id: string): void {
    const post: Post = {
      image: "https://media.istockphoto.com/photos/melbourne-central-business-district-picture-id600688368?k=20&m=600688368&s=612x612&w=0&h=hbN7pEOSGuyzbygdh-vgj5mmBeGne2NHDYlojpfmoTw=",
      postDescr: "Visited Melbourne",
      likes: [],
      creator: '',
      comments: []
    }
    this.crudService.updateObject(Collections.POSTS, id, post).subscribe();
  }

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
              console.log(this.isLike)
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

  public openPostModal(image: string | null, postDescr: string | null, likes: number, postId: string): void{
    let popUp = this.dialogRef.open(PostModalComponent);
    popUp.componentInstance.image = image;
    popUp.componentInstance.postDescr = postDescr;
    popUp.componentInstance.likes = likes;
    popUp.componentInstance.postId = postId
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

}


