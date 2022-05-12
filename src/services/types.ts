import firebase from "firebase/compat/app";

export type FireBaseUser = firebase.User | null;
export type UserCredential = firebase.auth.UserCredential;

export type User = {
  userID: string;
  img: string;
  name: string;
  email: string;
  followers: string[];
  following: string[]
};

export type ID = {
  id: string;
}

export type Post = {
  // id: string;
  image: string | null;
  postDescr: string | null;
  likes: string[];
  creator: string;
}

export type UserStore = User & ID | null;
export type PostStore = Post & ID;
