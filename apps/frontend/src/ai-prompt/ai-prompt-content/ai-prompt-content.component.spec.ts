import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiPromptContentComponent } from './ai-prompt-content.component';

describe('AiPromptContentComponent', () => {
  let component: AiPromptContentComponent;
  let fixture: ComponentFixture<AiPromptContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPromptContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiPromptContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
