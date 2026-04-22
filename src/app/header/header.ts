import { Component, inject, signal, WritableSignal, Output, EventEmitter } from '@angular/core';
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

  @Output() sectionSelected = new EventEmitter<string>();

  selectSection(section: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.selectedSection.set(section);
    this.sectionSelected.emit(section);
  }
}
