import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  selectedSection: WritableSignal<string> = signal('home');

  selectSection(section: string) {
    this.selectedSection.set(section);
  }
}
