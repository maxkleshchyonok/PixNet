import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FriendsComponent} from "./friends/friends/friends.component";
import {ProfileComponent} from "./profile/profile/profile.component";
import {FeedComponent} from "./feed/feed/feed.component";

const routes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full'},
  {path: 'friends', component: FriendsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'feed', component: FeedComponent}
]

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
