import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollToTop } from "./components/scroll-to-top/scroll-to-top";
import { DisableRightClickDirective } from './directives/disable-right-click.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollToTop, DisableRightClickDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');
}
