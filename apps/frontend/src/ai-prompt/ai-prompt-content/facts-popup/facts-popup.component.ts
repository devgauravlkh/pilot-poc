import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../ai-prompt-content.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'poc-ai-facts-popup',
  templateUrl: './facts-popup.component.html',
  styleUrl: './facts-popup.component.css',
})
export class FactsPopupComponent {
  professionValue: string = '';
  name: string = '';
  occupationForm: FormGroup = new FormGroup({});
  parentForm: FormGroup = new FormGroup({});
  childrenForm: FormGroup = new FormGroup({});
  currentFormGroup: FormGroup = new FormGroup({});

  constructor(
    private dialogRef: MatDialogRef<FactsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.createForm();
   }


  createForm(){
    this.occupationForm = this.fb.group({
      occupationInput: ['', Validators.required]
    });

    this.parentForm = this.fb.group({
      parentInput: ['',  [Validators.required,
      Validators.pattern('^[0-9]{1,3}$'),
      Validators.min(0),
      Validators.max(100)]]
    });

    this.childrenForm = this.fb.group({
      childrenInput: ['',  [Validators.required,
        Validators.pattern('^[0-9]{1,3}$'),
        Validators.min(0),
        Validators.max(100)]]
    })

    if (this.data.value === 'occupation') {
      this.currentFormGroup = this.occupationForm;
    } else if(this.data.value === 'parents') {
      this.currentFormGroup = this.parentForm;
    } else if(this.data.value === 'children') {
      this.currentFormGroup = this.childrenForm;
    }
  }

  get parentsInput() {
    return this.parentForm.get('parentInput');
  }

  get childrenInput() {
    return this.childrenForm.get('childrenInput');
  }

  changeInput(event: any) {
    this.professionValue = event.value;
  }
  
  closePopup() {
    if (this.currentFormGroup.valid) {
      this.dialogRef.close({name: this.data.name, value: this.professionValue});
    } else {
      this.currentFormGroup.markAllAsTouched();
    }
  }
}
