import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Currency {
  private apiKey = 'a4e71165d717afb06c5be6e3'; 
  private baseUrl = 'https://v6.exchangerate-api.com/v6';

  constructor(private http: HttpClient) {}

  getRates(baseCurrency: string) {
    return this.http.get(`${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`);
  }
}