import { TestBed } from "@angular/core/testing";
import { PieDataService } from "./pieData.service";

describe("PieDataService", () => {
  let service: PieDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PieDataService] });
    service = TestBed.get(PieDataService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe('generateData', () => {
    it('should generate the correct number of operations', () => {
      const num = 5;
      const result = service.generateData(num);
  
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(num);
      expect(result.length).toBeGreaterThan(0);
  
      result.forEach(operation => {
        expect(operation.id).toBeDefined();
        expect(operation.familyType).toBeDefined();
        expect(operation.name).toBeDefined();
        expect(operation.type).toBeDefined();
      });
    });
  });
});
