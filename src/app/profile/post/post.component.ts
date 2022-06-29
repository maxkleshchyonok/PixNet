import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import firebase from "firebase/compat";
import {CrudService} from "../../../services/crud/crud.service";
import {Collections} from "../../../services/crud/collections";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";
import {Post, PostStore, UserStore} from "../../../services/types";
import {filter, map, switchMap, take, tap} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {PostModalComponent} from "../post-modal/post-modal.component";
import {ActivatedRoute} from "@angular/router";
import {LikesModalComponent} from "../post-modal/likes-modal/likes-modal.component";


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

  public userOnScreenEmail: string | undefined = '';

  public blockedList: string[] | undefined = [];

  public isBlocked: boolean = false;

  constructor(private authService: AuthService,
              private crudService: CrudService,
              private dialogRef: MatDialog,
              public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log(this.postDescr)
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.userId = value?.uid!;
      this.userEmail = value?.email!
    })
    console.log(this.userEmail)
    this.activatedRoute.params.pipe(
      switchMap((value) => {
        return this.crudService.handleData<UserStore>(Collections.USERS,).pipe(
          tap((currentUser: UserStore[]) => {
            currentUser.forEach((user) => {
              if (user?.id == value['id']) {
                this.userOnScreenEmail = user?.email;
              }
            })
          }))
      }),
      // switchMap(() => {
      //   return this.crudService.handleCreatorData<PostStore>(Collections.POSTS, '==', this.userOnScreenEmail!).pipe(
      //     tap((currentPosts: PostStore[]) => {
      //       this.postsOnScreen = currentPosts
      //     })
      //   )
      // }),
      switchMap(() => {
        return this.crudService.handleCreatorData<PostStore>(Collections.POSTS, '==', this.userOnScreenEmail!).pipe(
          tap((currentPosts: PostStore[]) => {
            this.postsOnScreen = currentPosts;
            return this.postsOrder(currentPosts)
          })
        )
      }),
      switchMap((value) => {
        return this.crudService.handleData<UserStore>(Collections.USERS).pipe(
          tap((userStore: UserStore[]) => {
            this.isBlocked = false;
            userStore.forEach((user)=>{
              console.log(this.isBlocked)
              if(user?.email==this.userEmail && user?.blocked?.includes(this.userOnScreenEmail!)){
                  this.isBlocked = true;
              }
            })
          })
        )
      }),
    ).subscribe((value) => {
      console.log(value)
    })
    this.authService.user$.pipe(
      tap((value: firebase.User | null) => this.user = value),
      filter((value: firebase.User | null) => !!value),
      switchMap(() => {
        return this.crudService.handleData<UserStore>(Collections.USERS,).pipe(
          tap((currentUser: UserStore[]) => {
            console.log(currentUser)
            currentUser.forEach((user) => {
              if (user?.id == this.activatedRoute.snapshot.paramMap.get('id')) {
                this.userOnScreenEmail = user?.email;
              }
            })
          }))
      }),
    ).subscribe()
  }

  public delete(id: string): void {
    console.log(id);
    this.crudService.deleteObject(Collections.POSTS, id).subscribe();
  }

  public change() {
    this.isLike = !this.isLike
  }


  public updateLikes(id: string): any {
    console.log(id)
    this.authService.user$.pipe(
      filter((value: firebase.User | null) => !!value),
      switchMap((value: firebase.User | null) => {
        return this.crudService.getUserDoc<PostStore>(Collections.POSTS, id).pipe(
          map((post) => {
            const userIndex = post?.likes.indexOf(value?.email!);
            console.log(userIndex);
            if (userIndex === -1) {
              this.isLike = true;
              return post?.likes.concat(value?.email!)
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

  public openPostModal(image: string | null, postDescr: string | null, likes: string[] | undefined, postId: string): void{
    let popUp = this.dialogRef.open(PostModalComponent);
    popUp.componentInstance.image = image;
    popUp.componentInstance.postDescr = postDescr;
    popUp.componentInstance.likes = likes;
    popUp.componentInstance.postId = postId
  }

  public openLikesModal(likes: string[] | undefined): void {
    let popUp = this.dialogRef.open(LikesModalComponent);
    popUp.componentInstance.likes = likes;

  }

  public postsOrder(arr: PostStore[]){
    return arr.sort((a: PostStore, b: PostStore) => {
      return b.date - a.date
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

}


