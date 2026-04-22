import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSignal: WritableSignal<string> = signal('en');
  public readonly currentLanguage = computed(() => this.currentLangSignal());

  constructor(private translateService: TranslateService) {
    const savedLang = localStorage.getItem('appLang') || 'en';
    this.translateService.setDefaultLang('en');
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    // Map custom select ids to i18n filenames
    const langMap: { [key: string]: string } = {
      'En': 'en',
      'No': 'no',
      'Ru': 'ru',
      'Ua': 'ua',
      'en': 'en',
      'no': 'no',
      'ru': 'ru',
      'ua': 'ua'
    };
    
    const code = langMap[lang] || 'en';
    this.translateService.use(code);
    this.currentLangSignal.set(code);
    localStorage.setItem('appLang', code);
  }
}
