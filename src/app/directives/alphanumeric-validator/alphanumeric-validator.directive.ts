import { Directive, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({  
  selector: '[appAlphanumericValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphanumericValidatorDirective,
      multi: true
    }
  ]
})

export class AlphanumericValidatorDirective implements Validator {
  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const isValidLength = value.length >= 3;
    const isAlphaNumeric = /^[a-zA-Z0-9\s]*$/.test(value);

    if (!isValidLength) {
      return {
        minLength: {
          requiredLength: 3,
          message: `Minimum 3 characters required`
        }
      };
    }

    if (!isAlphaNumeric) {
      return {
        alphanumeric: { message: 'Only letters, numbers and spaces are allowed. No special characters.' }};
      }

    return null;
  }
}
