import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {FriendsComponent} from "./friends/friends/friends.component";
import {ProfileComponent} from "./profile/profile/profile.component";
import {FeedComponent} from "./feed/feed/feed.component";
import {StartPageComponent} from "./start-page/start-page.component";
import {AuthGuard} from "../services/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: 'friends', component: FriendsComponent, canActivate:[AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'feed', component: FeedComponent, canActivate:[AuthGuard]},
  {path: 'start', component: StartPageComponent}
]

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
