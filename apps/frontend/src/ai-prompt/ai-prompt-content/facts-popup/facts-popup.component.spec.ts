import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactsPopupComponent } from './facts-popup.component';

describe('FactsPopupComponent', () => {
  let component: FactsPopupComponent;
  let fixture: ComponentFixture<FactsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FactsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
