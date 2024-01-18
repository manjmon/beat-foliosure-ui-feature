import { TestBed } from '@angular/core/testing';
import { ConsolidatedReportModuleFilter } from './module-filter-pipe';

describe('ConsolidatedReportModuleFilter', () => {
  let pipe: ConsolidatedReportModuleFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsolidatedReportModuleFilter]
    });
    pipe = TestBed.get(ConsolidatedReportModuleFilter);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('filters items based on the filter array', () => {
      const items = [
        { subPageId: 1, moduleID: 0 },
        { subPageId: 2, moduleID: 0 },
        { subPageId: 3, moduleID: 1 },
      ];
      const filter = [
        { subPageId: 1, moduleID: 0 },
        { subPageId: 0, moduleID: 1 },
      ];

      const result = pipe.transform(items, filter);

      expect(result).toEqual([
        { subPageId: 1, moduleID: 0 },
        { subPageId: 3, moduleID: 1 },
      ]);
    });
  });
});
