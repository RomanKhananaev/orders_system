import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadIndicatorService {
  visibleIndicator = false;
  constructor() { }
}
