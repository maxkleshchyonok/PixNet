import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {from, map, Observable, take} from "rxjs";
import firebase from "firebase/compat/app";
import DocumentReference = firebase.firestore.DocumentReference;
import WhereFilterOp = firebase.firestore.WhereFilterOp;

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  public getUserDoc<T>(collectionName: string, id: string) : Observable<T | undefined> {
    const snapshot: Observable<firebase.firestore.DocumentSnapshot<T>> = this.angularFirestore
      .collection(collectionName)
      .doc(id)
      .get() as Observable<firebase.firestore.DocumentSnapshot<T>>;
    return snapshot.pipe(map((value: firebase.firestore.DocumentSnapshot<T>) =>  value.data()));
  }

  public getData<T>(collectionName: string): Observable<T[]> {
    return this.handleData<T>(collectionName).pipe(take(1));
  }

  public handleData<T>(collectionName: string): Observable<T[]> {
    return this.angularFirestore
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const {id} = a.payload.doc;
            return {id, ...data} as T;
          }),
        ),
      );
  }

  public handleMailData<T>(collectionName: string, value: string): Observable<T[]> {
    return this.angularFirestore
      .collection(collectionName, ref => {
        const query: firebase.firestore.Query = ref;
        return query.where('email', '==', value);
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const {id} = a.payload.doc;
            return {id, ...data} as T;
          }),
        ),
      );
  }

  public handleIdData<T>(collectionName: string, operator: WhereFilterOp, value: string): Observable<T[]> {
    return this.angularFirestore
      .collection(collectionName, ref => {
        const query: firebase.firestore.Query = ref;
        return query.where('userID', operator, value);
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const {id} = a.payload.doc;
            return {id, ...data} as T;
          }),
        ),
      );
  }

  public handleEmailData<T>(collectionName: string, operator: WhereFilterOp, value: string): Observable<T[]> {
    return this.angularFirestore
      .collection(collectionName, ref => {
        const query: firebase.firestore.Query = ref;
        return query.where('email', operator, value);
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            console.log(data)
            const {id} = a.payload.doc;
            console.log(id)
            return {id, ...data} as T;
          }),
        ),
      );
  }

  public handleCreatorData<T>(collectionName: string, operator: WhereFilterOp, value: string): Observable<T[]> {
    return this.angularFirestore
      .collection(collectionName, ref => {
        const query: firebase.firestore.Query = ref;
        return query.where('creator', operator, value);
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            console.log(data)
            const {id} = a.payload.doc;
            console.log(id)
            return {id, ...data} as T;
          }),
        ),
      );
  }


  public createObject<T>(collectionName: string, object: T): Observable<DocumentReference<T>> {
    return (from(this.angularFirestore
      .collection(collectionName)
      .add(object)) as Observable<DocumentReference<T>>).pipe(take(1));
    from(this.angularFirestore.collection(collectionName).add(object)).pipe(take(1))
  }

  public updateObject(collectionName: string, id: string, data: {}): Observable<void> {
    return from(
      this.angularFirestore
        .collection(collectionName)
        .doc(id)
        .set(data, {merge: true}),
    ).pipe(take(1));
  }

  public deleteObject(collectionName: string, id: string): Observable<void> {
    return from(
      this.angularFirestore
        .collection(collectionName)
        .doc(id)
        .delete())
      .pipe(take(1));
  }
}
