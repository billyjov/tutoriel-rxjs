import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription, of, from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  ngOnInit() {

    const observer = {
      next: (item: unknown) => console.log(`Une boite arrive ${item}`),
      error: (err: unknown) => console.log(`Oups il ya une erreur ${err}`),
      complete: () => console.log('terminé...plus rien')
    };

    const stream = new Observable(myObserver => {
      myObserver.next('Boite 1');
      myObserver.error(new Error());
      myObserver.next('Boite 2');
      // for (let index = 0; index < 1000000; index++) {
      //   myObserver.next('Boite');
      // }
      myObserver.complete();
      myObserver.next('Boite 3');
    });

    const subscription = stream.subscribe(
      item => console.log(`Une boite arrive ${item}`),
      err => console.log(`Oups il ya une erreur ${err}`),
      () => console.log('terminé...plus rien')
    );

    subscription.unsubscribe();

    of(1, 2, 3, 4).subscribe(console.log)

    from([12, 13, 14, 15]).subscribe(
      (item: number) => console.log(`ma valeur ${item}`),
      (err: unknown) => console.error(err),
      () => console.log('Termine')
    )
  }


  public start(): void {
    this.subscription.add(interval(1000).subscribe(
      value => console.log('ma valeur: ', value),
      error => console.error(error),
      () => console.log('terminé')
    ))

    this.subscription.add(interval(1000).subscribe(
      value => console.warn('=== ma valeur === : ', value),
      error => console.error(error),
      () => console.warn('=== terminé ===')
    ))
  }

  public stop(): void {
    this.subscription.unsubscribe();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
