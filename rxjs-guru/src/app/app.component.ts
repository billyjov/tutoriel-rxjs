import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription, of, from } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  ngOnInit() {



    from([1, 2, 12, 13, 14, 0, 15])
      .pipe(
        tap(elem => console.log(elem)),
        map((elem: number) => {
          if (elem === 0) {
            throw new Error('zero erreur')
          }

          return elem * 2;
        }),
        map(item => item - 2),
        take(2)
      )
      .subscribe(
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
