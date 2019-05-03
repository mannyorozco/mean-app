import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error.component.html'
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
