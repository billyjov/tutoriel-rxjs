import { Injectable } from '@angular/core';
import { IHotel } from '../models/hotel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, combineLatest, Subject, merge } from 'rxjs';
import { catchError, map, scan, shareReplay, tap } from 'rxjs/operators';
import { Category } from '../models/category';


@Injectable({
  providedIn: 'root'
})
export class HotelListService {

  private readonly HOTEL_API_URL = 'api/hotels';

  public hotelsWithCategories$ = combineLatest([
    this.getHotels(),
    this.getCategories()
  ])
    .pipe(
      map(([hotels, categories]) =>
        hotels.map(hotel => ({
          ...hotel,
          price: hotel.price * 1.5,
          category: categories.find(category => category.id === hotel.categoryId)?.name
        }) as IHotel)
      )
  );

  private hotelInsertedSubject = new Subject<IHotel>();
  public hotelInserted$ = this.hotelInsertedSubject.asObservable();

  public hotelsWithAdd$ = merge(
    this.hotelsWithCategories$,
    this.hotelInserted$
  ).pipe(
    scan((acc: IHotel[], value: IHotel) => {
      const index = acc.findIndex((hotel) => hotel.id === value.id);
      if (index !== -1) {
        acc[index] = value;
        return acc;
      }

      return [...acc, value];
    }),
    shareReplay(1)
  )

  constructor(private http: HttpClient) {

  }

  public addOrUpdateHotel(newHotel: IHotel): void {
    this.hotelInsertedSubject.next(newHotel);
  }


  public getHotels(): Observable<IHotel[]> {
    return this.http.get<IHotel[]>(this.HOTEL_API_URL).pipe(
      tap(hotels => console.log('hotels: ', hotels)),
      catchError(this.handleError)
    );
  }

  public getHotelById(id: number): Observable<IHotel> {
    const url = `${this.HOTEL_API_URL}/${id}`;

    if (id === 0) {
      return of(this.getDefaultHotel());
    }
    return this.http.get<IHotel>(url).pipe(
      catchError(this.handleError)
    );
  }

  public createHotel(hotel: IHotel): Observable<IHotel> {
    hotel = this.transformHotel(hotel);
    return this.http.post<IHotel>(this.HOTEL_API_URL, hotel).pipe(
      catchError(this.handleError)
    );
  }


  public updateHotel(hotel: IHotel): Observable<IHotel> {
    const url = `${this.HOTEL_API_URL}/${hotel.id}`;

    return this.http.put<IHotel>(url, hotel).pipe(
      catchError(this.handleError)
    );
  }

  public deleteHotel(id: number): Observable<{}> {
    const url = `${this.HOTEL_API_URL}/${id}`;

    return this.http.delete<IHotel>(url).pipe(
      catchError(this.handleError)
    );
  }

  private transformHotel(hotel: IHotel): IHotel {
    return {
      ...hotel,
      imageUrl: 'assets/img/hotel-room.jpg',
      id: null
    };
  }

  private getDefaultHotel(): IHotel {
    return {
      id: 0,
      hotelName: null,
      description: null,
      price: null,
      rating: null,
      imageUrl: null
    };
  }

  public getCategories(): Observable<Category[]> {
    return of([
      {
        id: 0,
        name: 'Motel'
      }, {
        id: 1,
        name: 'Auberge'
      }
    ])
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      errorMessage = `An error occured: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      errorMessage = `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`;
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.' +
      '\n' +
      errorMessage
    );
  }
}
