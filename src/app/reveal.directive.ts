import { Directive, ElementRef, inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

/**
 * Adds scroll-triggered fade + slide-up. Respects prefers-reduced-motion via CSS.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  /** Extra delay before transition starts (e.g. stagger lists with $index * 70). */
  @Input() appRevealDelay = 0;

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'reveal');
    if (this.appRevealDelay > 0) {
      host.style.setProperty('--reveal-delay', `${this.appRevealDelay}ms`);
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(host, 'is-revealed');
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
