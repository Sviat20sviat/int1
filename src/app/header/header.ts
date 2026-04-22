import { Component, inject, signal, WritableSignal, Output, EventEmitter, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../theme.service';
import { CustomSelectComponent } from '../shared/custom-select/custom-select';
import { LanguageService } from '../shared/language/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit {
  themeService = inject(ThemeService);
  langService = inject(LanguageService);
  destroyRef = inject(DestroyRef);
  selectedSection: WritableSignal<string> = signal('home');

  languageControl = new FormControl('En');
  availableLanguages = [
    { name: 'Englsh', id: 'En' },
    { name: 'Norwegian Bokmal', id: 'No' },
    { name: 'Russian', id: 'Ru' },
    { name: 'Ukrainian', id: 'Ua' },
  ];

  @Output() sectionSelected = new EventEmitter<string>();

  ngOnInit() {
    const revMap: { [key: string]: string } = { 'en': 'En', 'no': 'No', 'ru': 'Ru', 'ua': 'Ua' };
    const savedLang = this.langService.currentLanguage();
    this.languageControl.setValue(revMap[savedLang] || 'En', { emitEvent: false });

    this.languageControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        if (val) {
          this.langService.setLanguage(val);
        }
      });
  }

  selectSection(section: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.selectedSection.set(section);
    this.sectionSelected.emit(section);
  }
}
