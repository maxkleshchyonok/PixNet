import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { SortComponent } from './sort/sort.component';
import { PostComponent } from './post/post.component';
import { AddPostButtonComponent } from './add-post-button/add-post-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileInfoComponent,
    SortComponent,
    PostComponent,
    AddPostButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
