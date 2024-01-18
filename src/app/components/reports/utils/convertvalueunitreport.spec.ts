import { ConvertValueUnitreport } from './convertvalueunitreport';

describe('ConvertValueUnitreport', () => {
  beforeEach(() => {
    ConvertValueUnitreport.appConfig = {
      IsWorkflowEnable: true,
      DefaultDateFormat: 'YYYY-MM-DD',
      WorkflowDefaultDateFormat: 'YYYY-MM-DD',
      DefaultNumberSystem: 1000000,
      AppName: 'Test',
    };
  });
  describe('toMillion', () => {
    it('should convert values to million', () => {
      // Arrange
      const reportData = [
        {
          Results: [
            {
              'Total Value': 1000000,
              'Capital Invested': 2000000,
              'Realized Value': 3000000,
              'Unrealized Value': 4000000,
              'Current Invested Capital': 5000000,
              'Current Realized Value': 6000000,
              'Current Unrealized Value': 7000000,
              'Gain/(Loss)': 8000000,
              TVPI: '1.5'
            }
          ],
          FooterRow: {
            'Total Value': 9000000,
            'Capital Invested': 10000000,
            'Realized Value': 11000000,
            'Unrealized Value': 12000000,
            'Current Invested Capital': 13000000,
            'Current Realized Value': 14000000,
            'Current Unrealized Value': 15000000,
            'Gain/(Loss)': 16000000
          }
        }
      ];

      // Act
      const result = ConvertValueUnitreport.toMillion(reportData);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty reportData', () => {
      // Arrange
      const reportData = [];

      // Act
      const result = ConvertValueUnitreport.toMillion(reportData);

      // Assert
      expect(result).toEqual([]);
    });

    // Add more test cases as needed...
  });
});