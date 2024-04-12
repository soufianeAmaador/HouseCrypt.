import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeModalComponent } from './pledge-modal.component';

describe('PledgeModalComponent', () => {
  let component: PledgeModalComponent;
  let fixture: ComponentFixture<PledgeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PledgeModalComponent]
    });
    fixture = TestBed.createComponent(PledgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
