import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { SortComponent } from './profile/sort/sort.component';
import { PostComponent } from './profile/post/post.component';
import { AddPostButtonComponent } from './profile/add-post-button/add-post-button.component';
import { StatusComponent } from './profile/status/status.component';
import { SubscribeButtonComponent } from './profile/subscribe-button/subscribe-button.component';
import {AppRoutingModule} from "./app-routing.module";
import {FriendsComponent} from "./friends/friends/friends.component";
import {FeedComponent} from "./feed/feed/feed.component";
import {ProfileComponent} from "./profile/profile/profile.component";
import { StartPageComponent } from './start-page/start-page.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import { PopUpComponent } from './profile/pop-up/pop-up.component';
import { PostModalComponent } from './profile/post-modal/post-modal.component';
import { SearchComponent } from './header/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileInfoComponent,
    SortComponent,
    PostComponent,
    AddPostButtonComponent,
    StatusComponent,
    SubscribeButtonComponent,
    FriendsComponent,
    FeedComponent,
    ProfileComponent,
    StartPageComponent,
    PopUpComponent,
    PostModalComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
