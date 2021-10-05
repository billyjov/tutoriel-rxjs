import { Component, OnInit } from '@angular/core';
import { Observable, of, EMPTY, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
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


  constructor(private hotelListService: HotelListService) {

  }

  ngOnInit() {
    this.hotels$ = this.hotelListService.hotelsWithCategories$.pipe(
      catchError((err) => {
        this.errMsg = err

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
      if(filter === '') return hotels;

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
