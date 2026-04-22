import { Component, inject, signal, WritableSignal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ThemeService } from '../theme.service';
import { CustomSelectComponent } from '../shared/custom-select/custom-select';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  selectedSection: WritableSignal<string> = signal('home');

  languageControl = new FormControl('En');
  availableLanguages = [
    { name: 'Englsh', id: 'En' },
    { name: 'Norwegian Bokmal', id: 'No' },
    { name: 'Russian', id: 'Ru' },
    { name: 'Ukrainian', id: 'Ua' },
  ];

  @Output() sectionSelected = new EventEmitter<string>();

  selectSection(section: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.selectedSection.set(section);
    this.sectionSelected.emit(section);
  }
}
