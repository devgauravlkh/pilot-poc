import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiPromptComponent } from './ai-prompt.component';
import { AiPromptContentComponent } from './ai-prompt-content/ai-prompt-content.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FactsPopupComponent } from './ai-prompt-content/facts-popup/facts-popup.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AiPromptComponent,
    AiPromptContentComponent,
    FactsPopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AiPromptComponent,
    AiPromptContentComponent,
    FactsPopupComponent
  ]
})
export class AiPromptModule { }
