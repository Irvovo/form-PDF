import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibeFormComponent } from './exibe-form.component';

describe('ExibeFormComponent', () => {
  let component: ExibeFormComponent;
  let fixture: ComponentFixture<ExibeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExibeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExibeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
