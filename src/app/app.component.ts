import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alien-numeral';
  result: number | null = null;

  symbols = [
    { char: 'A', value: 1 },
    { char: 'B', value: 5 },
    { char: 'Z', value: 10 },
    { char: 'L', value: 50 },
    { char: 'C', value: 100 },
    { char: 'D', value: 500 },
    { char: 'R', value: 1000 }
  ];

  examples = [
    {
      input: 'AAA',
      output: 3,
      explanation: 'A = 1, A = 1, A = 1'
    },
    {
      input: 'LBAAA',
      output: 58,
      explanation: 'L = 50, B = 5, A = 1, A = 1, A = 1'
    },
    {
      input: 'RCRZCAB',
      output: 1994,
      explanation: 'R = 1000, CR = 900, ZC = 90, AB = 4'
    }
  ];

  mainForm = new FormGroup({
    symbols: new FormControl('', [Validators.required, Validators.pattern('^[ABZLCDR]+$')])
  });

  convertNumeral() {
    if (this.mainForm.valid) {
      const symbols = this.mainForm.controls.symbols.value;
      if (symbols) {
        this.result = this.symbolsToInteger(symbols);
      }
    }
  }

  setExample(value: string) {
    this.mainForm.controls.symbols.setValue(value);
    this.convertNumeral();
  }

  symbolsToInteger(symbols: string): number {
    const symbolValues: { [key: string]: number } = {};
    this.symbols.forEach(item => {
      symbolValues[item.char] = item.value;
    });

    let result = 0;
    let i = 0;

    while (i < symbols.length) {
      const currentValue = symbolValues[symbols[i]];

      if (i + 1 < symbols.length) {
        const nextValue = symbolValues[symbols[i + 1]];

        if ((currentValue === 1 && (nextValue === 5 || nextValue === 10)) ||
          (currentValue === 10 && (nextValue === 50 || nextValue === 100)) ||
          (currentValue === 100 && (nextValue === 500 || nextValue === 1000))) {
          result += (nextValue - currentValue);
          i += 2;
          continue;
        }
      }

      result += currentValue;
      i++;
    }

    return result;
  }
}
