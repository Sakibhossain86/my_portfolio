import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly currentYear = new Date().getFullYear();
  readonly menuOpen = signal(false);
  /** Which nav section is aligned with the viewport (scrollspy). */
  readonly activeSection = signal<string>('');

  readonly navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  readonly skills = [
    { name: '.NET / ASP.NET Core', detail: 'Web APIs, EF Core, clean architecture' },
    { name: 'Angular', detail: 'Standalone, RxJS, reactive UIs' },
    { name: 'Microsoft SQL Server', detail: 'T-SQL, indexing, performance' },
    { name: 'REST & integration', detail: 'Auth flows, third-party APIs' },
    { name: 'DevOps basics', detail: 'CI-friendly builds, Azure-friendly deploys' }
  ];

  readonly experiences = [
    {
      role: 'Software Developer',
      company: 'Priyoshop.com · Dhanmondi, Dhaka, Bangladesh',
      period: '2023 — Present',
      bullets: [
        'Develop and maintain modern web applications using ASP.NET Core and Angular.',
        'Optimize RESTful APIs for mobile and web platforms, ensuring smooth data flow and performance efficiency.',
        'Develop SQL queries, stored procedures, and database functions to support backend processes.',
        'Maintain Git repositories for version control, ensuring collaborative and organized development.'
      ]
    }
  ];

  readonly projects = [
    {
      title: 'Enterprise dashboard',
      desc: 'Role-based SPA with real-time summaries backed by a .NET API.',
      stack: 'Angular · .NET · SQL Server',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
      imageAlt: 'Analytics dashboard on a monitor',
      links: { live: '#', repo: '#' }
    },
    {
      title: 'API & integration layer',
      desc: 'Secure REST services with validation, logging, and documented contracts.',
      stack: '.NET Web API · EF Core · SQL',
      image:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&auto=format&fit=crop',
      imageAlt: 'Code on screen',
      links: { live: '#', repo: '#' }
    },
    {
      title: 'Data reporting toolkit',
      desc: 'Parameterized reports and exports for operations teams.',
      stack: 'SQL Server · .NET · Angular',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop',
      imageAlt: 'Laptop with charts',
      links: { live: '#', repo: '#' }
    }
  ];

  constructor() {
    afterNextRender(() => {
      const onScrollOrResize = () => this.syncActiveNavFromScroll();
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });
      this.syncActiveNavFromScroll();
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      });
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  scrollToSection(id: string): void {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.activeSection.set('');
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (this.navLinks.some((l) => l.id === id)) {
        this.activeSection.set(id);
      }
    }
    this.menuOpen.set(false);
  }

  /** Picks the last section whose top has crossed below the header + offset (document order). */
  private syncActiveNavFromScroll(): void {
    const header = document.querySelector('.header');
    const headerH = header?.getBoundingClientRect().height ?? 64;
    const trigger = window.scrollY + headerH + 40;
    let current = '';
    for (const { id } of this.navLinks) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= trigger) {
        current = id;
      }
    }
    if (this.activeSection() !== current) {
      this.activeSection.set(current);
    }
  }
}
