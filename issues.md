Existing Issues

-- [src/app/components/dataExtraction/portfolioCompany-DataExtraction.component.html] the code being commented, how ever as per business requirement the commented out code is to be required. When commented out the ngModel bindings where missing.

quarterOptions: any = [
    { value: "Q1", text: "Q1" },
    { value: "Q2", text: "Q2" },
    { value: "Q3", text: "Q3" },
    { value: "Q4", text: "Q4" },
  ]; is repeated in multiple places. Need to be moved to one file.

keep  1 chart for financial kpi chart in portfolio company detail component.

  