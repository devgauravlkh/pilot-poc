import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { FactsPopupComponent } from './facts-popup/facts-popup.component';
import { HttpClient } from '@angular/common/http';
import {
  ALLKEYS,
  CHILDREN,
  LIFE_STAGE,
  MARITAL_STATUS,
  OCCUPATION,
  PARENTS,
  SAVINGS,
} from './ai-prompt.data';

export interface DialogData {
  name: string;
  value: string;
}

@Component({
  selector: 'poc-ai-ai-prompt-content',
  templateUrl: './ai-prompt-content.component.html',
  styleUrl: './ai-prompt-content.component.css',
})
export class AiPromptContentComponent {
  @ViewChild('clientProfile') clientProfile:
    | ElementRef<HTMLElement>
    | undefined;
  allKeys: string[] = ALLKEYS;
  names: string[] = OCCUPATION;
  savings: string[] = SAVINGS;
  maritalStatus: string[] = MARITAL_STATUS;
  lifeStage: string[] = LIFE_STAGE;
  parents: string[] = PARENTS;
  children: string[] = CHILDREN;

  currentKeyIndex: number = 0;
  promptForm: FormGroup = new FormGroup({});
  selectedOccupation: string = 'Select';
  selectedParents: string = 'Select';
  selectedChildren: string = 'Select';
  disabledOptions: string[] = [];
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AiPromptContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    this.createForm();
  }

  createForm() {
    this.promptForm = this.fb.group({
      textArea: ['', Validators.required],
      facts: this.fb.array([]),
    });
  }

  get keysArray() {
    return this.promptForm.get('facts') as FormArray;
  }

  addKey(): void {
    if (this.currentKeyIndex < this.allKeys.length) {
      const nextKey = this.allKeys[this.currentKeyIndex];
      this.keysArray.push(this.fb.control({ name: nextKey, value: 'Select' }));
      this.currentKeyIndex++;
    }
  }

  removeKey(i: number, itemToRemove: string): void {
    this.currentKeyIndex = this.currentKeyIndex - 1;
    this.keysArray.removeAt(i);
    const indexInDisabled = this.disabledOptions.indexOf(itemToRemove);
    if (indexInDisabled !== -1) {
      this.disabledOptions.splice(indexInDisabled, 1);
    }
  }

  onSubmit(): void {
    this.loading = true;
    console.log(' => this.promptForm.value: ', this.promptForm.value);
    this.keysArray.markAllAsTouched();
    this.promptForm.markAllAsTouched();
    if (
      this.promptForm.value.textArea === '' ||
      this.keysArray.controls.some((control) => control.value.value === '')
    )
      return;
    this.http
      .post('http://localhost:3000/result', this.promptForm.value)
      .subscribe((res: any) => {
        if (this.clientProfile) {
          this.clientProfile.nativeElement.innerHTML =
            res['message'].message.content;
            this.loading = false;
        }
      });
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  addValue(item: ClientProfile, value: any): void {
    item.value = value.value;
  }

  optionSelected(option: string): void {
    this.keysArray.push(this.fb.control({ name: option, value: '' }));
    const index = this.allKeys.findIndex((item) => item === option);
    if (index !== -1) this.disabledOptions.push(option);
  }

  select(item: ClientProfile, event: any, type: string): void {
    if (event === 'Select') item.value = '';
    if (type === 'occupation') {
      this.selectedOccupation = event;
      item.value = event;
      if (event === 'Others') this.openPopup('occupation', item, 'occupation');
    } else if (type === 'parents') {
      this.selectedParents = event;
      this.openPopup('parents', item, event);
    } else if (type === 'children') {
      if (event === 'No Children') this.selectedChildren = event;
      else {
        this.selectedChildren = event;
        this.openPopup('children', item, event);
      }
    } else item.value = event;
  }

  openPopup(value: string, item: ClientProfile, event?: string): void {
    const dialogRef = this.dialog.open(FactsPopupComponent, {
      width: '400px',
      height: '240px',
      data: { value: value, name: event },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.value = result.value;
        if (value === 'occupation') this.selectedOccupation = result.value;
        if (value === 'parents') this.selectedParents = result.value;
        if (value === 'children') this.selectedChildren = result.value;
      }
    });
  }
}

interface ClientProfile {
  name: string;
  value: string;
}
