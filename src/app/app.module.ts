import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { HeaderComponent } from './profile/header/header.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { SortComponent } from './profile/sort/sort.component';
import { PostComponent } from './profile/post/post.component';
import { AddPostButtonComponent } from './profile/add-post-button/add-post-button.component';
import { StatusComponent } from './profile/status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileInfoComponent,
    SortComponent,
    PostComponent,
    AddPostButtonComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
