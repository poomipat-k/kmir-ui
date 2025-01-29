import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getYearMonthDay(date: Date) {
    const localeDate = date.toLocaleDateString('en-US', {
      timeZone: 'Asia/bangkok',
    });
    const [month, day, year] = localeDate?.split('/').map((s) => +s);
    return [year, month, day];
  }

  getDateAndTime(date: Date): string[] {
    const localeDate = date.toLocaleString('en-GB', {
      timeZone: 'Asia/bangkok',
    });
    return localeDate.split(', ');
  }
}
