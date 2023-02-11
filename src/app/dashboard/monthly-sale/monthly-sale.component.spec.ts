import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySaleComponent } from './monthly-sale.component';

describe('MonthlySaleComponent', () => {
  let component: MonthlySaleComponent;
  let fixture: ComponentFixture<MonthlySaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
