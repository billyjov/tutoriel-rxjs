import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IHotel } from '../shared/models/hotel';
import { HotelListService } from '../shared/services/hotel-list.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {

  public hotel$: Observable<IHotel> = of(<IHotel>{});
  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('id');

    this.hotel$ = this.hotelService.getHotels()
      .pipe(
        map((hotels: IHotel[]) => hotels.find(hotel => hotel.id === id)),
        tap((hotel: IHotel) => console.log(hotel))
      );
  }

  public backToList(): void {
    this.router.navigate(['/hotels']);
  }

}
