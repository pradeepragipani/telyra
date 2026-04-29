import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[disableRightClick]',
  standalone: true,
})
export class DisableRightClickDirective {
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
}
