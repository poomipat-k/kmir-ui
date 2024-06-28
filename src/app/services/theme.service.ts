import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  public currentTheme: WritableSignal<'gold' | 'silver'> = signal('gold');

  public changeTheme(theme: 'gold' | 'silver'): void {
    this.currentTheme.set(theme);
  }
}
