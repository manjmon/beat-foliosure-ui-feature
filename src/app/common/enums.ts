export enum PageConfigurationSubFeature
{
   
    StaticInformation = 1,
  
    KeyPerformanceIndicator = 2,
   
    CompanyFinancials = 3,
   
    Commentary = 4,
    
    BasicDetails = 5,
   
    PortfolioCompanyFundHoldingDetails = 6,
   
    FundStaticInformation = 7,
    
    FundTerms = 8,
    
    TrackRecord = 9,
    
    GeographicLocations = 10,
  
    InvestmentProfessionals = 11,
    FundGeographicLocations = 12
}

export enum UserPermissionEntity {  
    PortfolioCompany = 1,   
    Funds = 2,     
    Firms = 3,  
    Deals = 4
}

export enum PageConfigurationPageDetails{
    ESG = 9
}
export enum FileUploadModule{
    ESG = 47,
    FundofFunds = 13,
}
export enum FileStatus{
    Uploaded = 1,
    Processing = 2,
    Successful = 3,
    Failed = 4,
    Cancelled = 5
}