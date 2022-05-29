import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import firebase from "firebase/compat";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {Post, PostStore, UserStore} from "../../../services/types";
import {filter, map, switchMap, take, tap} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {PostModalComponent} from "../../profile/post-modal/post-modal.component";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit{

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

  public userOnScreenEmail: string | undefined = '';

  public feedPosts: PostStore[] = [];

  public feedPeople: string[] | undefined = [];


  constructor(private authService: AuthService,
              private crudService: CrudService,
              private dialogRef: MatDialog,
              public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.userId = value?.uid!)
    this.authService.user$.subscribe((value: firebase.User | null) => this.userEmail = value?.email!)
    console.log(this.userEmail)

    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleEmailData<UserStore>(Collections.USERS, '==', this.userEmail).pipe(
          tap((currentUser: UserStore[]) => {
            this.feedPeople = currentUser[0]?.following
          }
          ))
      }),
      switchMap(() => {
        return this.crudService.handleData<PostStore>(Collections.POSTS).pipe(
          tap((currentPosts: PostStore[]) => {
            currentPosts.forEach((post) => {
              this.feedPeople?.forEach((user) => {
                if(post.creator == user){
                  this.feedPosts?.push(post)
                }
              })
            })
          })
        )
      })
    ).subscribe();

  }

  public updateLikes(id: string): any {
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











