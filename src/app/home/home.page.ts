import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton
} from '@ionic/angular/standalone';
import { Currency } from '../services/currency';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
    FormsModule, CommonModule, RouterLink
  ],
})
export class HomePage implements OnInit {
  fromCurrency = 'USD';
  toCurrency = 'BRL';
  amount: number = 1;
  currencies: string[] = [];
  result: number | null = null; 

  constructor(private currencyService: Currency) {} 

  ngOnInit() {
  this.currencyService.getRates(this.fromCurrency).subscribe((data: any) => {
    this.currencies = Object.keys(data.conversion_rates);
  });
}
  convert() {
  this.currencyService.getRates(this.fromCurrency).subscribe({
    next: (data: any) => {
      this.currencies = Object.keys(data.conversion_rates);
      const rate = data.conversion_rates[this.toCurrency];
      this.result = this.amount * rate;

      localStorage.setItem('taxas_' + this.fromCurrency, JSON.stringify(data.conversion_rates));

      const historico = JSON.parse(localStorage.getItem('historico') || '[]');
      historico.push({
        de: this.fromCurrency,
        para: this.toCurrency,
        valor: this.amount,
        resultado: this.result,
        data: new Date().toLocaleString()
      });
      localStorage.setItem('historico', JSON.stringify(historico));
    },
    error: () => {
      const cache = localStorage.getItem('taxas_' + this.fromCurrency);
      if (cache) {
        const rates = JSON.parse(cache);
        this.currencies = Object.keys(rates);
        this.result = this.amount * rates[this.toCurrency];
      }
    }
  });
}

  swap() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
  }
}
