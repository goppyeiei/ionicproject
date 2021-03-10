import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurdService {
  constructor(private fs: AngularFirestore) {}

  readData() {
    return this.fs.collection('todolist').snapshotChanges();
  }
  createData(todolist: any) {
    return this.fs.collection('todolist/').add(todolist);
  }

  updateDataIn(docId: any, todolist: any) {
    return this.fs.doc('todolist/' + docId).update(todolist);
  }

  delDataIn(docId: any) {
    return this.fs.doc('todolist/' + docId).delete();
  }
}
