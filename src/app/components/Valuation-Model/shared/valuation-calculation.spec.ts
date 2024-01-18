import { ValuationCalclation } from "../shared/valuation-calculation";

describe('ValuationCalclation', () => {
    it('should return postive Number', () =>{
        const result = ValuationCalclation.isPositiveNumber(5);
        expect(result).toBeTruthy()
    });
    it('should return Negative  Number', () =>{
        const result = ValuationCalclation.isPositiveNumber(-5);
        expect(result).toBeFalsy()
    });
    it('should return null', () =>{
        const result = ValuationCalclation.isPositiveNumber(null);
        expect(result).toBeFalsy()
    });
    it('should return undefined', () =>{
        const result = ValuationCalclation.isPositiveNumber(undefined);
        expect(result).toBeFalsy()
    });

    describe('GetCalcuationSchemaForOverAll' , () => {
        it('should spy on GetCalcuationSchemaForOverAll for Mean', () =>{
            const name = 'Mean'
            spyOn(ValuationCalclation, 'GetCalcuationSchemaForOverAll').and.callThrough();
            ValuationCalclation.GetCalcuationSchemaForOverAll(name);
            expect(ValuationCalclation.GetCalcuationSchemaForOverAll).toHaveBeenCalled();
        })
    });
    it('should spy on GetCalcuationSchemaForOverAll for Median', () =>{
        const name = 'Median'
        spyOn(ValuationCalclation, 'GetCalcuationSchemaForOverAll').and.callThrough();
        ValuationCalclation.GetCalcuationSchemaForOverAll(name);
        expect(ValuationCalclation.GetCalcuationSchemaForOverAll).toHaveBeenCalled();
    });

    describe('roundOffCalculatedValue' , () => {
        it('should spy on roundOffCalculatedValue', () =>{
            const name = 123
            spyOn(ValuationCalclation, 'roundOffCalculatedValue').and.callThrough();
            ValuationCalclation.roundOffCalculatedValue(name);
            expect(ValuationCalclation.roundOffCalculatedValue).toHaveBeenCalled();
        })
    });

    describe('GetCalcuationSchemaForOverAll for Mean' , () => {
        it('should GetCalcuationSchemaForOverAll MockData for Mean ', () =>{
            const result = ValuationCalclation.GetCalcuationSchemaForOverAll('Mean');
            expect(result).toEqual({ 
                peers: "Mean",
                ticker: "",
                cssClass: "over-all-mean",
                  },
            )
        })
    });
    it('should GetCalcuationSchemaForOverAll MockData for for Median', () =>{
        const result = ValuationCalclation.GetCalcuationSchemaForOverAll('Median');
        expect(result).toEqual({
            peers: "Median",
            ticker: "",
            cssClass: "over-all-median",
        })
    });

    describe('GetCalcuationSchemaTransactionForOverAll' , () => {
        it('should Spy on GetCalcuationSchemaTransactionForOverAll for Mean', () =>{
            const name = 'Mean'
            spyOn(ValuationCalclation, 'GetCalcuationSchemaTransactionForOverAll').and.callThrough();
            ValuationCalclation.GetCalcuationSchemaTransactionForOverAll(name);
            expect(ValuationCalclation.GetCalcuationSchemaTransactionForOverAll).toHaveBeenCalled();
        })
    });
    it('should Spy on GetCalcuationSchemaTransactionForOverAll for Median', () =>{
        const name = 'Median'
        spyOn(ValuationCalclation, 'GetCalcuationSchemaTransactionForOverAll').and.callThrough();
        ValuationCalclation.GetCalcuationSchemaTransactionForOverAll(name);
        expect(ValuationCalclation.GetCalcuationSchemaTransactionForOverAll).toHaveBeenCalled();
    });

    describe('GetCalcuationSchemaTransactionForOverAll for Mean' , () => {
        it('should GetCalcuationSchemaTransactionForOverAll MockData for Mean ', () =>{
            const result = ValuationCalclation.GetCalcuationSchemaTransactionForOverAll('Mean');
            expect(result).toEqual({

                    TargetName: "Mean",
                    sector: "",
                    cssClass: "over-all-mean",
                  },
            )
        })
    });
    it('should GetCalcuationSchemaTransactionForOverAll MockData for for Median', () =>{
        const result = ValuationCalclation.GetCalcuationSchemaTransactionForOverAll('Median');
        expect(result).toEqual({
            TargetName: "Median",
            sector: "",
            cssClass: "over-all-median",
        })
    });

    describe('GetCalcuationSchema' , () => {
        it('should spy on GetCalculationSchema for Mean', () =>{
            const name = 'Mean'
            spyOn(ValuationCalclation, 'GetCalcuationSchema').and.callThrough();
            ValuationCalclation.GetCalcuationSchema(name);
            expect(ValuationCalclation.GetCalcuationSchema).toHaveBeenCalled();
        })
    });
    it('should spy on GetCalculationSchema for Median', () =>{
        const name = 'Median'
        spyOn(ValuationCalclation, 'GetCalcuationSchema').and.callThrough();
        ValuationCalclation.GetCalcuationSchema(name);
        expect(ValuationCalclation.GetCalcuationSchema).toHaveBeenCalled();
    });

    describe('GetCalcuationSchema for Mean' , () => {
        it('should GetCaluctionSchema MockData for Mean ', () =>{
            const result = ValuationCalclation.GetCalcuationSchema('Mean');
            expect(result).toEqual({
                data: {
                    name: "Mean",
                    peers: "",
                    ticker: "",
                    cssClass: "sector-mean",
                  }
            })
        })
    });
    it('should GetCaluctionSchema MockData for for Median', () =>{
        const result = ValuationCalclation.GetCalcuationSchema('Median');
        expect(result).toEqual({
            data: {
                name: "Median",
                peers: "",
                ticker: "",
                cssClass: "sector-median",
              }
        })
    });

    describe('GetCalucuationSchemaTransaction' , () => {
        it('should spy on GetcaluculationschemaTransaction for Mean', () =>{
            const name = 'Mean'
            spyOn(ValuationCalclation, 'GetCalucuationSchemaTransaction').and.callThrough();
            ValuationCalclation.GetCalucuationSchemaTransaction(name);
            expect(ValuationCalclation.GetCalucuationSchemaTransaction).toHaveBeenCalled();
        })
    });
    it('should spy on GetcaluculationschemaTransaction for Median', () =>{
        const name = 'Median'
        spyOn(ValuationCalclation, 'GetCalucuationSchemaTransaction').and.callThrough();
        ValuationCalclation.GetCalucuationSchemaTransaction(name);
        expect(ValuationCalclation.GetCalucuationSchemaTransaction).toHaveBeenCalled();
    });
    describe('GetCalucuationSchemaTransactionMockData for Mean' , () => {
        it('should get calcualtion schema Mean for Transaction', () =>{
            const result = ValuationCalclation.GetCalucuationSchemaTransaction('Mean');
            expect(result).toEqual({
                data: {
                    name: "Mean",
                    TargetName: '',
                    sector: '',
                    cssClass: "sector-mean",
                  }
            })
        })
    });
    it('should get calcualtion schema MockData for Median', () =>{
        const result = ValuationCalclation.GetCalucuationSchemaTransaction('Median');
        expect(result).toEqual({
            data: {
                name: "Median",
                TargetName: '',
                sector: '',
                cssClass: "sector-median",
              }
        })
    });

    describe('setImpliedERowWithoutSector', () =>{
        it('should spy on setImpliedERowWithoutSector for Mean', () =>{
            const name = 'Mean';
            const element= { title: ''};
        ValuationCalclation.setImpliedERowWithoutSector(name, element);
        expect(element.title).toBe('Mean - Overall');
        });

        it('should spy on setImpliedERowWithoutSector for Mean', () =>{
            const name = 'Median';
            const element= { title: ''};
        ValuationCalclation.setImpliedERowWithoutSector(name, element);
        expect(element.title).toBe('Median - Overall');
        });
        it('should spy on setImpliedERowWithoutSector for default', () =>{ 
            const element= { title: ''};
        ValuationCalclation.setImpliedERowWithoutSector('Unknown', element);
        expect(element.title).toBe('');
        });
    });
    describe('setImpliedERowSector', () =>{
        it('should spy on setImpliedERowSector for Mean', () =>{
            const name = 'Mean - Overall';
            const element= { title: ''};
        ValuationCalclation.setImpliedERowSector(name, element);
        expect(element.title).toBe('Mean - Overall');
        });

        it('should spy on setImpliedERowSector for Mean', () =>{
            const name = 'Median - Overall';
            const element= { title: ''};
        ValuationCalclation.setImpliedERowSector(name, element);
        expect(element.title).toBe('Median - Overall');
        });
        it('should spy on setImpliedERowSector for default', () =>{

            const element= { title: ''};
        ValuationCalclation.setImpliedERowSector('Unknown', element);
        expect(element.title).toBe('');
        });
    });

    describe('prepareAsOnMonth', () =>{
        it('should return value for undefined', () => {
            let period = "Q1"
            const quarterAndYear =  ValuationCalclation.prepareAsOnMonth(undefined, undefined);
            expect(quarterAndYear).toBe('')
        });
        it('should return value for empty', () => {
            const quarterAndYear =  ValuationCalclation.prepareAsOnMonth('', "");
            expect(quarterAndYear).toBe('')
        });
        it('should return value for empty', () => {
            const quarterAndYear =  ValuationCalclation.prepareAsOnMonth('Q1 2023', undefined);
            expect(quarterAndYear).toBe('Mar 2023')
        });
        it('should return value for empty', () => {
            const quarterAndYear =  ValuationCalclation.prepareAsOnMonth('Q2 2023', '');
            expect(quarterAndYear).toBe('Jun 2023')
        });
        it('should return value for empty', () => {
            const quarterAndYear =  ValuationCalclation.prepareAsOnMonth('Q3 2023', "period");
            expect(quarterAndYear).toBe('Sep 2023')
        });
        it('should return value for empty', () => {
            const quarterAndYear =  ValuationCalclation.prepareAsOnMonth('Q4 2023', "periodtwo");
            expect(quarterAndYear).toBe('Dec 2023')
        });
    })
}); 