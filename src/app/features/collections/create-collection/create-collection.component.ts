import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectionsService } from '../../../core/services/collections/collections.service';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './create-collection.component.html',
  styleUrl: './create-collection.component.scss'
})
export class CreateCollectionComponent implements OnInit {
  
  form: FormGroup;
  isSubmitting = false;
  isDialog: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private collectionsService: CollectionsService,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<CreateCollectionComponent>
  ) {
    this.form = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.isDialog = !!this.dialogRef;
  }

  createCollection(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.form.value;

    try {
      this.collectionsService.createCollection(
        formValue.title.trim(),
        formValue.description?.trim() || '',
      );

      let successMessage = 'Collection "' + formValue.title + '" created successfully!';
      this.showSnackBar(successMessage, 'success');
      this.goBack();

    } catch (error) {
      console.error('Failed to create collection:', error);
      this.showSnackBar('Failed to create collection. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

   goBack(): void {
    if (this.isDialog && this.dialogRef) {
      this.dialogRef!.close();
    } else {
      this.router.navigate(['/collections']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const config = {
      duration: type === 'error' ? 5000 : 3000,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Close', config);
  }

  onFormSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.createCollection();
    }
  }

  getCharacterCount(fieldName: string): number {
    return this.form.get(fieldName)?.value?.length || 0;
  }

  hasFieldError(fieldName: string, errorType: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) return `${fieldName} is required`;
    if (field.hasError('minlength')) return `${fieldName} is too short`;
    if (field.hasError('maxlength')) return `${fieldName} is too long`;
    
    return '';
  }
}