import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msgVal: string = '';  
  myData: Array<any>;
  currentUser: string = '';
    constructor(private http:Http, public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
      this.http.get('https://jsonplaceholder.typicode.com/photos')
      .map(response => response.json())
      .subscribe(res => this.myData = res);

      this.items = af.list('/messages', {
          query: {
            limitToLast: 50
          }
        });
        this.user = this.afAuth.authState;                           
      }

    ngOnInit() {
      this.currentUser ='';
      this.afAuth.authState
          .subscribe(user => this.currentUser = user.displayName);
    }

    loginGoogle() {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());     
    }

    login() {
        this.afAuth.auth.signInAnonymously();              
    }
    
    logout() {
        this.afAuth.auth.signOut();        
    }
    
    Send(desc: string) {
        this.items.push({ message: desc});
        this.msgVal = '';
    }
}
