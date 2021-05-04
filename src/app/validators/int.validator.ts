import { AbstractControl } from '@angular/forms';
export function ValidateInt(control: AbstractControl) {
  const INT_REGEXP =  /^\d+$/;
  return !INT_REGEXP.test(control.value) ? {invalidInt: true} : null;
} // ValidateInt
