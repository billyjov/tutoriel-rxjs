import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
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
  filter$: BehaviorSubject<string>;


  public showBadge: boolean = true;
  private _hotelFilter = 'mot';
  public filteredHotels: IHotel[] = [];
  public filteredHotels$: Observable<IHotel[]> = of([]);
  public receivedRating: string;
  public errMsg: string;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;


  constructor(private hotelListService: HotelListService) {

  }

  ngOnInit() {
    this.hotels$ = this.hotelListService.getHotels();
    // this.filteredHotels$ = this.hotels$;

    this.hotelListService.getHotels().subscribe({
      next: hotels => {
        this.hotels = hotels;
        this.filteredHotels = this.hotels;
      },
      error: err => this.errMsg = err
    });
    this.hotelFilter = '';
    this.filter$ = new BehaviorSubject('');
    this.filteredHotels$ = this.createFilterHotels(this.filter$, this.hotels$);
  }


  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {

    this._hotelFilter = filter;

    // if (this.hotelFilter) {
    //   this.filteredHotels$ = this.hotels$.pipe(
    //     map((hotels: IHotel[]) => this.filterHotels(filter, hotels))
    //   );
    // } else {
    //   this.filteredHotels$ = this.hotels$;
    // }


    // this.filteredHotels = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
  }

  public receiveRatingClicked(message: string): void {
    this.receivedRating = message;
  }


  private filterHotels(criteria: string, hotels?: IHotel[]): IHotel[] {
    criteria = criteria.toLocaleLowerCase();

    const res = hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) !== -1
    );

    return res;
  }


  public createFilterHotels(
    filter$: Observable<string>,
    hotels$: Observable<IHotel[]>) {
    // We combine both of the input streams using the combineLatest
    // operator. Every time one of the two streams we are combining
    // here changes value, the project function is re-executed and
    // the result stream will get a new value. In our case this is
    // a new array with all the filtered characters.
    return combineLatest(
      hotels$,
      filter$, (hotels: IHotel[], filter: string) => {
        if (filter === '') return hotels;
        return hotels.filter(
          (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(filter) !== -1
        );
      });
  }

  filterChanged(value: string) {
    console.log('yeahh value changed filter: ', value);
    // Everytime we have new value, we pass it to the filter$
    this.filter$.next(value);
  }
}
