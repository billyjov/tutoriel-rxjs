import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {

    const observer = {
      next: (item: unknown) => console.log(`Une boite arrive ${item}`),
      error: (err: unknown) => console.log(`Oups il ya une erreur ${err}`),
      complete: () => console.log('terminé...plus rien')
    };

    const stream = new Observable(myObserver => {
      myObserver.next('Boite 1');
      myObserver.next('Boite 2');
      myObserver.next('Boite 3');
      // for (let index = 0; index < 1000000; index++) {
      //   myObserver.next('Boite');
      // }
      myObserver.complete();
    });

    const subscription = stream.subscribe(
      item => console.log(`Une boite arrive ${item}`),
      err => console.log(`Oups il ya une erreur ${err}`),
      () => console.log('terminé...plus rien')
    );

  }
}
