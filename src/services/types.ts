import firebase from "firebase/compat/app";

export type FireBaseUser = firebase.User | null;
export type UserCredential = firebase.auth.UserCredential;

export type User = {
  userID: string | undefined;
  image: string;
  name: string | undefined;
  email: string;
  status: string;
  followers: string[] | undefined;
  following: string[] | undefined;
};

export type ID = {
  id: string;
}

export type Post = {
  image: string | null;
  postDescr: string | null;
  likes: string[];
  creator: string;
  comments: []
}

export type Comment = {
  userPhoto: string;
  userName: string
  text: string;
  time: number;
  postId: string;
  userEmail: string | null
}

export type UserStore = User & ID | null;
export type PostStore = Post & ID;
export type CommentStore = Comment & ID;
