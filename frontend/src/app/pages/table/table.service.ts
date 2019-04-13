import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor() {}

  validateUrl(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}
