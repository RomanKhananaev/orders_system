import { Component } from '@angular/core';
import { LoadIndicatorService } from './services/load-indicator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public loadIndicator: LoadIndicatorService) { }

  title = 'app';
}
