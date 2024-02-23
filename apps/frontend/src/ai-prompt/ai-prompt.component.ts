import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AiPromptContentComponent } from './ai-prompt-content/ai-prompt-content.component';

@Component({
  selector: 'poc-ai-ai-prompt',
  templateUrl: './ai-prompt.component.html',
  styleUrl: './ai-prompt.component.css',
})

export class AiPromptComponent {
  data: string = '';
  isPromptOpened: boolean = false;
  keysToShow: string[] = [];
  allKeys: string[] = ['occupation', 'lifeStage', 'maritalStatus', 'children', 'parents', 'savings'];
  savings: string[] = [ 'Less than $250k', '$250 to 500k', '$500 to $2MM', '$2MM to $10MM', '$10MM or More'];
  currentKeyIndex: number = 0; 
  disabled: boolean = false;

  constructor(private dialog: MatDialog) {
    this.openPrompt();
  }
  
  addKey(): void {
    if (this.currentKeyIndex < this.allKeys.length) {
      const nextKey = this.allKeys[this.currentKeyIndex];
      this.keysToShow.push(nextKey);
      this.currentKeyIndex++;
    } else this.disabled = true;
  }

  removeKey(i: number) {
    this.currentKeyIndex = this.currentKeyIndex - 1;
    this.keysToShow.splice(i, 1);
  }

  openPrompt(): void {
      const dialogRef = this.dialog.open(AiPromptContentComponent, {
        width: '100%',
        height: 'calc(100vh - 16px)',
        maxHeight: '100%',
        maxWidth: '100%',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.isPromptOpened = false;
      });
    }
}

