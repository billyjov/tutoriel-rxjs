import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelDetailGuard implements CanActivate {

  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const id = +next.url[1].path;

    if (isNaN(id) || id <= 0) {
      alert('Hotel est inconnu');

      this.router.navigate(['/hotels']);
      return false;
    }

    return true;
  }

}
