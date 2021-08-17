import { Component, OnInit } from '@angular/core';
import { Hotel, IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  public title = 'Liste hotels';

  public hotels: IHotel[] = [];

  public showBadge: boolean = true;
  private _hotelFilter = 'mot';
  public filteredHotels: IHotel[] = [];
  public receivedRating: string;
  public errMsg: string;


  constructor(private hotelListService: HotelListService) {

  }

  ngOnInit() {
    this.hotelListService.getHotels().subscribe({
      next: hotels => {
        this.hotels = hotels;
        this.filteredHotels = this.hotels;
      },
      error: err => this.errMsg = err
    });
    this.hotelFilter = '';
  }


  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter;

    this.filteredHotels = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
  }

  public receiveRatingClicked(message: string): void {
    this.receivedRating = message;
  }


  private filterHotels(criteria: string): IHotel[] {
    criteria = criteria.toLocaleLowerCase();

    const res = this.hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(criteria) !== -1
    );

    return res;
  }
}
