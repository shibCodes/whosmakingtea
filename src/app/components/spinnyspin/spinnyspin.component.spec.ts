import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnyspinComponent } from './spinnyspin.component';

describe('SpinnyspinComponent', () => {
  let component: SpinnyspinComponent;
  let fixture: ComponentFixture<SpinnyspinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnyspinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnyspinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
