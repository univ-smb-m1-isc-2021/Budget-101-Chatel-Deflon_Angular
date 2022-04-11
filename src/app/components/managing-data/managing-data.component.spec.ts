import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagingDataComponent } from './managing-data.component';

describe('ManagingDataComponent', () => {
  let component: ManagingDataComponent;
  let fixture: ComponentFixture<ManagingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagingDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
