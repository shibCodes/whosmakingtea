////////////////////////////////
////////// ANGULAR CORE
import { Directive, OnInit, Input, ElementRef, Renderer } from '@angular/core';


/*@Directive({ selector: '[focusElement]' })

export class FocusDirective implements OnInit {
 
  @Input('focusElement') isFocused: boolean;
 
  constructor(private hostElement: ElementRef, private renderer: Renderer) {}
 
  ngOnInit() {
    if (this.isFocused) {
      this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
    }
  }
}*/

@Directive({
  selector : 'input'
})
export class FocusDirective {
  constructor(public renderer: Renderer, public elementRef: ElementRef) {}

  ngOnInit() {
    this.renderer.invokeElementMethod(
      this.elementRef.nativeElement, 'focus', []);
  }
}