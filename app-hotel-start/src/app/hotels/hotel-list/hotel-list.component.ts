import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, of, EMPTY, Subject, BehaviorSubject, combineLatest, interval, merge, concat } from 'rxjs';
import { catchError, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelListComponent implements OnInit {
  public title = 'Liste hotels';

  public hotels: IHotel[] = [];
  public hotels$: Observable<IHotel[]> = of([]);

  public showBadge: boolean = true;
  private _hotelFilter = 'mot';
  public filteredHotels: IHotel[] = [];
  public filteredHotels$: Observable<IHotel[]> = of([]);
  public filterSubject: Subject<string> = new BehaviorSubject<string>('');
  public receivedRating: string;
  public errMsg: string;
  private errMsgSubject: Subject<string> = new Subject<string>();
  public errMsg$ = this.errMsgSubject.asObservable();

  constructor(
    private hotelListService: HotelListService,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    const hotelTest$ = of(1, 2, 3)
      .pipe(
        mergeMap(val => this.http.get<IHotel>(`api/hotels/${val}`))
      );


    hotelTest$.subscribe((elem) => {
      console.log('hello: ', elem);
    });
    const hotelTest1$ = of(1, 2, 3)
      .pipe(
        concatMap(val => this.http.get<IHotel>(`api/hotels/${val}`))
      );

    hotelTest1$.subscribe((elem) => {
      console.log('COncatMap: ', elem);
    });


    const hotelTest2$ = of(1, 2, 3)
      .pipe(
        switchMap(val => this.http.get<IHotel>(`api/hotels/${val}`))
      );

    hotelTest2$.subscribe((elem) => {
      console.warn('SwitchMap: ', elem);
    });
    // const obs1$ = interval(1000).pipe(
    //   take(3),
    //   map((val) => 'A ' + val)
    // );
    // const obs2$ = interval(1000).pipe(
    //   take(3),
    //   map((val) => 'B ' + val)
    // );

    // merge(obs1$, obs2$).subscribe(val => console.log('Merge: ', val));
    // concat(obs1$, obs2$).subscribe(val => console.warn('Concat: ', val));

    this.hotels$ = this.hotelListService.hotelsWithAdd$.pipe(
      catchError((err) => {
        this.errMsgSubject.next(err);

        return EMPTY;
      })
    );

    this.filteredHotels$ = this.createFilterHotels(this.filterSubject, this.hotels$);
    this.hotelFilter = '';
  }

  public filterChange(value: string): void {
    this.filterSubject.next(value);
  }


  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter;

  }

  public createFilterHotels(filter$: Observable<string>, hotels$: Observable<IHotel[]>): Observable<IHotel[]> {
    return combineLatest(hotels$, filter$, (hotels: IHotel[], filter: string) => {
      if (filter === '') return hotels;

      return hotels.filter(
        (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(filter) !== -1
      );
    });
  }

  public receiveRatingClicked(message: string): void {
    this.receivedRating = message;
  }


  private filterHotels(criteria: string, hotels: IHotel[]): IHotel[] {
    criteria = criteria.toLocaleLowerCase();

    const res = hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) !== -1
    );

    return res;
  }
}
