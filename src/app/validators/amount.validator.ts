import { AbstractControl } from '@angular/forms';
export function ValidateAmount(control: AbstractControl) {
  const AMOUNT_REGEXP = /^\d+(\.\d{1,2})?$/i;
  return !AMOUNT_REGEXP.test(control.value) ? {invalidAmount: true} : null;
} // ValidateAmount
