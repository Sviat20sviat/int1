import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSignal: WritableSignal<string> = signal('en');
  public readonly currentLanguage = computed(() => this.currentLangSignal());

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');

    const savedLang = localStorage.getItem('appLang');
    if (savedLang) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage(this.getBrowserLanguage());
    }
  }

  private getBrowserLanguage(): string {
    if (typeof navigator === 'undefined') return 'en';

    // navigator.language format is mostly 'en-US', 'ru-RU', 'uk', etc.
    const lang = navigator.language.toLowerCase();
    console.log('lang', lang);

    if (lang.startsWith('ru') || lang.startsWith('be') || lang.startsWith('kk')) {
      return 'en';
    }
    if (lang.startsWith('uk')) {
      return 'ua';
    }
    if (lang.startsWith('no') || lang.startsWith('nb') || lang.startsWith('nn')) {
      return 'no';
    }

    return 'en';
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
