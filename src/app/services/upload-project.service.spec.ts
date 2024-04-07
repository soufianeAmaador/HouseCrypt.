import { TestBed } from '@angular/core/testing';

import { UploadeProjectService } from './upload-project.service';

describe('UploadeProjectService', () => {
  let service: UploadeProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadeProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
