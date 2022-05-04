import firebase from "firebase/compat/app";

export type FireBaseUser = firebase.User | null;
export type UserCredential = firebase.auth.UserCredential;

// export type User = {
//   name: string;
//   surname: string;
//   email: string
// };

export type User = {
  id: string;
  img: string;
  name: string;
  email: string
};

export type ID = {
  id: string;
}

export type Post = {
  image: string | null;
  postDescr: string | null;
  likes: string[];
  // isLiked: boolean
}

export type UserStore = User & ID | null;
export type PostStore = Post & ID;
