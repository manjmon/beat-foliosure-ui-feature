export class GlobalConstants {
  public static SomethingWentWrong: string = "Something went wrong";
  public static  RevertSuccess:string="Changes reverted successfully";
  public static Manual = "Manual";
  public static Actual = "actual";
  public static Budget = "budget";
  public static KpiFillter = {
    first: 0,
    rows: 1000,
    globalFilter: null,
    multiSortMeta: [
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ],
    sortOrder: -1,
  };
}
export class CommonConstants{
 public static quarterOptions: any = [
      { value: "Q1", text: "Q1", number: 1 },
      { value: "Q2", text: "Q2", number: 2 },
      { value: "Q3", text: "Q3", number: 3 },
      { value: "Q4", text: "Q4", number: 4 },
    ];
  public static monthOptions: any = [
      { value: "Jan", text: "January", number: 1 },
      { value: "Feb", text: "February", number: 2 },
      { value: "Mar", text: "March", number: 3 },
      { value: "Apr", text: "April", number: 4 },
      { value: "May", text: "May", number: 5 },
      { value: "Jun", text: "June", number: 6 },
      { value: "Jul", text: "July", number: 7 },
      { value: "Aug", text: "August", number: 8 },
      { value: "Sep", text: "September", number: 9 },
      { value: "Oct", text: "October", number: 10 },
      { value: "Nov", text: "November", number: 11 },
      { value: "Dec", text: "December", number: 12 }]
}
export class RepositoryConstants {
  public static sharedFolderType: string = "Shared Folder";
  public static privateFolderType: string = "Private Folder";
  public static generalFolderType: string = "General Folder";
  public static recycledFolderType: string = "Recycle Bin";
  public static uploadedFolderType: string = "Uploaded Files";
  public static finalFolderType: string = "Final Files";
  public static Uploaded: string = "Uploaded";
  public static Final: string = "Final";
}


export class KpiTypesConstants {
  public static OPERATIONAL_KPI: string = "Operational KPI";
  public static INVESTMENT_KPI: string = "Investment KPI";
  public static COMPANY_KPI: string = "Company KPI";
  public static IMPACT_KPI: string = "Impact KPI";
  public static PROFIT_LOSS_KPI: string = "Profit & Loss KPI";
  public static BALANCE_SHEET_KPI: string = "Balance Sheet KPI";
  public static CASHFLOW_KPI: string = "Cashflow KPI";
  public static CREDIT_KPI: string = "Credit KPI";
  public static TRADING_RECORDS: string = "Trading Records";
  public static kpiMaxLength: number = 200;
  public static descritionMaxLength: number = 1000;
}
export class KpiTypesPrefixConstants {
  public static OPERATIONAL_KPI_PREFIX: string = "Opr_";
  public static INVESTMENT_KPI_PREFIX: string = "Inv_";
  public static COMPANY_KPI_PREFIX: string = "Com_";
  public static IMPACT_KPI_PREFIX: string = "Imp_";
  public static PROFIT_LOSS_KPI_PREFIX: string = "Pro_";
  public static BALANCE_SHEET_KPI_PREFIX: string = "Bal_";
  public static CASHFLOW_KPI_PREFIX: string = "Cas_";
  public static CREDIT_KPI_PREFIX: string = "Cre_";
  public static TRADING_RECORDS_PREFIX: string = "Tra_";
}
export class KpiConstants {
  public static INVESTMENT_KPI: string = "Investment KPIs";
}
export function GetKpiTypes() {
  return [
      { name: KpiTypesConstants.OPERATIONAL_KPI, field:"Operational" },
      { name: KpiTypesConstants.INVESTMENT_KPI, field:"Investment" },
      { name: KpiTypesConstants.COMPANY_KPI , field:"Company"},
      { name: KpiTypesConstants.IMPACT_KPI, field:"Impact" },
      { name: KpiTypesConstants.PROFIT_LOSS_KPI, field:"ProfitAndLoss" },
      { name: KpiTypesConstants.BALANCE_SHEET_KPI, field:"BalanceSheet" },
      { name: KpiTypesConstants.CASHFLOW_KPI, field:"CashFlow" },
      { name: KpiTypesConstants.TRADING_RECORDS, field:"TradingRecords" },     
      
  ];
}
export function GeFundStatusTypes() {
  return [
      { name:"Unrealized"},
      { name:"Realized"},
      { name:"Partially Realized"},
      { name:"All"}
  ];
}
export function GetKpiInfoTypes() {
  return [
      { name: "Currency" },
      { name: "Number" },
      { name: "%"},
      { name: "Text" },
      { name: "x" },
  ];
}

export function GetReportTemplateActions() {
  return [
      { name: "Choose action", status: "" },
      { name: "Set as Active", status: "A" },
      { name: "Set as Inactive", status: "I" },
      { name: "Rename template", status: "R" },
      { name: "Delete template", status: "D" },
  ];
}
export function secureRandom(seed:number){
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  return randomBytes[0] % seed;
}
export function GetReportTemplatePreferenceOptions() {
  return [
      { name: "Excel Template",  isActive: true },
      { name: "Funds", isActive: false },
      { name: "Sections", isActive: false },
      { name: "Data Type", isActive: false },
      { name: "Calculations", isActive: false },
      { name: "Period Type",  isActive: false },
      { name: "Period",  isActive: false },
      { name: "Currency Unit",  isActive: false },
      { name: "Group",  isActive: false }
  ];
}
export function GetConsolidatedReportTemplatePreferenceOptions() {
  return [
      { name: "Funds", isActive: true },
      { name: "Sections", isActive: false },
      { name: "Excel Template",  isActive: false },
  ];
}
export function GetDataTypeOptions() {
  return [
      { name: "Actual Period", isActive: false },
      { name: "Future Period", isActive: false }
  ];
}
export function GetTemplatePeriodOptions() {
  return [
      { name: "Template Period", value:1 },
      { name: "Custom Period", value:2 }
  ];
}
export function GetTemplateUnits() {
  return [
      { name: "Absolute", value:0 },
      { name: "Thousands", value:1 },
      { name: "Millions", value:2 },
      { name: "Billions", value:3 }
  ];
}
export  class ReportTemplatePreferenceConstants {
  public static ExcelTemplate: string = "Excel Template";
  public static Funds: string = "Funds";
  public static Sections: string = "Sections";
  public static DataType: string = "Data Type";
  public static Calculations: string = "Calculations";
  public static PeriodType: string = "Period Type";
  public static Periods: string = "Period";
  public static CurrencyUnit: string = "Currency Unit";
  public static Group: string = "Group";
}
export  class ReportTypeConstants {
  public static InternalReport: string = "Internal Report";
  public static ConsolidatedReport: string = "Fund of Fund Report";
}
export class ReportTemplateConstants {
  public static Active: string = "Set as Active";
  public static InActive: string = "Set as Inactive";
  public static Rename: string = "Rename template";
  public static Delete: string = "Delete template";
  public static Action: string = "Choose action";
}
export class TemplateSections {
  public static Default: string ="Default Template";
  public static InvestmentTable: string = "KPI - Investment Table";
  public static InvestmentGraph: string = "KPI - Investment Graph";
  public static CompanyTable: string = "KPI - Company Table";
  public static CompanyGraph: string = "KPI - Company Graph";
  public static OperationalTable: string = "KPI - Operational Table";
  public static OperationalGraph: string = "KPI - Operational Graph";
  public static CreditTable: string = "KPI - Credit Table";
  public static CreditGraph: string = "KPI - Credit Graph";
  public static ImpactTable: string = "KPI - Impact Table";
  public static ImpactGraph: string = "KPI - Impact Graph";
  public static TradingTable: string = "KPI - Trading Record Table";
  public static TradingGraph: string = "KPI - Trading Record Graph";
  public static CompanyFinancials: string = "Company Financials";
}
export class FundEnum{
  public static  StaticData:string="Static Data";
  public static  StrategyDescription:string="Strategy Description";
  public static  FPChart:string="Fund Performance Chart";
  public static  SWTotalValueChart:string="Sector Wise Total Value Chart";
  public static  SWInvestmentValueChart:string="Sector Wise Investment Cost Chart";
  public static  TrackRecord:string="Track Record";
  public static AttributionReportTable:string="Attribution Report Table";
  public static AttributionReportGraph:string="Attribution Report Graph";
  public static FilterAddedSuccesfully: string = "Filter added succesfully"
  public static FilterDeletedSuccesfully: string = "Filter deleted succesfully"
}
export class NotificationConstants {
  public static VAPID_PUBLIC_KEY : string  = 'BJWor3koKGUnN9-HC7WMGNjIGLqpIL9i9ZGKMbnVyFPUgqrIXIhrwMFghFJ_9D-i3ejJbTMt5RzDnrS9-Dxzupo';
}

export function GeFundCashflowHeaders() {
  return [
      { header:"Company Name",field:"name"},
      { header:"Transaction Date",field:"Date"},
      { header:"Transaction Type",field:"Transaction Type"},
      { header:"Transaction Value",field:"value"}
  ];
}
export function GeFundCashflowReportingCurrencyTableHeaders() {
  return [
      { header:"Company Name",field:"name"},
      { header:"Reporting Currency",field:"currency"},
      { header:"Transaction Date",field:"date"},
      { header:"Transaction Type",field:"transactionType"},
      { header:"Transaction Value",field:"value"}
  ];
}

export function GeFundPerformanceHeaders() {
  return [
      { header:"Capital Invested",field:"capitalInvested"},
      { header:"Realized Value",field:"realizedValue"},
      { header:"Unrealized Value",field:"unrealizedValue"},
      { header:"Total Value",field:"totalValue"},
      { header:"Gross IRR",field:"IRR"},
      { header:"Gross TVPI",field:"TVPI"}
  ];
}

export function GeFundPerformanceReportingHeaders() {
  return [
      { header:"Reporting Currency",field:"currency"},
      { header:"Capital Invested",field:"capitalInvested"},
      { header:"Realized Value",field:"realizedValue"},
      { header:"Unrealized Value",field:"unrealizedValue"},
      { header:"Total Value",field:"totalValue"},
      { header:"Gross IRR",field:"irr"},
      { header:"Gross TVPI",field:"tvpi"}
  ];
}

export class FundCashflowConstants{
  public static Realised:string="Realised";
  public static Unrealised:string="Unrealised";
  public static All:string="All";
  public static Others:string="Others";
  public static FundCurrency:string="Fund Currency";
  public static ReportingCurrency:string="Reporting Currency";
  public static Name:string="name";
  public static Value:string="value";
  public static Date:string="Date";
  public static TransactionType:string="Transaction Type";
  public static IsRealizedValue:string="isRealizedValue";
  public static PortfolioCompanyId:string="portfolioCompanyId";
  public static FeesOrExpense:string="Fees/Expense";
  public static Fees:string="Fees";
  public static IsExpense:string="isExpense";
  public static Currency:string="currency";
  public static CapitalInvested:string="Capital Invested";
  public static RealizedValue:string="Realized Value";
  public static UnrealizedValue:string="Unrealized Value";
  public static IRR:string="IRR";
  public static TVPI:string="TVPI";
  public static TotalValue:string="Total Value";
  public static Total:string="Total";
  public static IsTotal:string="isTotal";
  public static TotalRealized:string="Total Realized";
  public static TotalUnRealized:string="Total Unrealized";
  public static CompanyName:string="Company Name";
  public static FundCashflow:string="Fund Cashflow";
  public static FundPerformance:string="Fund Performance";
}
export class DataAnalyticsConstants{
  public static InvestmentKpiURL:string="/api/get/investment/investment-kpi-values";
  public static OperationalKpiURL:string="/api/get/operational-kpi-values";
  public static TradingAndCompanyURL:string="/api/data-analytics/data-source";
  public static ProfitAndLossURL:string="/api/Financials/data-analytics/profitandloss";
  public static BalanceSheetURL:string="/api/Financials/data-analytics/balancesheet";
  public static CashFlowURL:string="/api/Financials/data-analytics/cashflow";
  public static getDealDataSourceURL:string = "/api/data-analytics/deals";
  public static GetFundsByInvestorURL:string = "/data-analytics/filters/funds"; 
  public static getFundsDataSourceURL:string = "/api/data-analytics/funds";
  public static getInvestorsDataSourceURL:string = "/api/data-analytics/investor";
  public static getPCDetailsDataSourceURL:string = "/api/data-analytics/bi/portfolio-company";
  public static getESGDetailsDataSourceURL:string = "/api/data-analytics/dummy";
  public static SubTitle:string = "Excel2Json";
  public static PostMethod = "POST";
  public static PeriodTypeLast1Year = "1 YR (Last 1 year)";
  public static PeriodTypeDateRange = "Date Range";
  public static PeriodTypeCustom = "Custom";
  public static PCDetails = "PC Informations";
  public static ESGDetails = "ESG Informations";
  public static DealDetails = "Deal Informations";
  public static FundDetails = "Fund Informations";
  public static InvestorDetails = "Investor Informations";
  public static FileSize = "File size is greater than 20 MB";
  public static MaxFileSize = 20;
  public static KiloByteSize = 1024;
  public static CancelFileProgress = "Cancel File Progress";
  public static RestDataSourceItem = "RestDataSourceItem";
  public static JsonDataSourceItem = "JsonDataSourceItem";
  public static CompanyName = "CompanyName";
  public static FundName = "FundName";
  public static InvestorName = "InvestorName";
  public static FundId = "FundId";
  public static InvestorId = "InvestorId";
  public static PCFundHoldingDetails = "PortfolioCompanyFundHoldingDetails";
  public static StaticInformation = "StaticInformation";
  public static FundStaticInformation = "FundStaticInformation";
  public static BasicDetails ="BasicDetails";
  public static StaticFundDetails ="FundDetails";
  public static FundTerms = "FundTerms";
  public static GeographicLocations = "GeographicLocations";
  public static TrackRecord = "TrackRecord";
  public static StaticDateFormat = "yyyy-MM-dd";
  public static NewDashboardTitle = "New Dashboard";
  public static deleteModalBody = "This action will delete the current dashboard. Are you sure you want to delete?";
  public static primaryDeleteButtonName = "Confirm";
  public static secondaryDeleteButtonName = "Cancel";
  public static deleteModalTitle = "Delete Dashboard";
  public static tabType = "tabType";
  public static isCreateDashboard = "isCreateDashboard";
  public static dataAnalyticsUploadModel = "dataAnalyticsUploadModel";
  public static SomethingWentWrong = "Something went wrong";
  public static GeneralTabName = "General";
  public static CommonTabName = "Common";
  public static MyDashboardTabName = "My Dashboard";
  public static edit = "edit";
  public static Dashboard = "Dashboard";
  public static Admin =  "Admin";
  public static PageConfig = "PageConfig";
  public static Operational_KPIs = "Operational KPIs"

}
export class WorkflowConstants{
  public static readonly TotalMarkedForRework: string = "Marked for Rework";
  public static readonly DiscardMessage: string = "This will delete the draft and the changes made. Are you sure you want to discard?";
  public static readonly TotalMarkedForReview: string = "Marked for Review";
  public static readonly TotalMarkedAsApproved: string = "Marked as Approved";
  public static readonly SubmitConstantsBetweenProcess: string = "Once submitted, portfolio company data cannot be edited again until current draft gets finalised/rejected. Are you confirm?";
  public static readonly SubmitConstantsFinalProcess: string = "Once submitted, portfolio company draft data will be published/rejected. Are you confirm?";
  public static readonly SectionEditingMessage: string = "Sections loaded for editing successfully";
  public static readonly SectionEditingSuccessfullMessage: string = "Sections available for editing updated successfully";
  public static readonly MarkedForReviewMessage: string = "Data edited and marked for review successfully";
  public static readonly MarkedForApprovalMessage: string = "Data marked for approval successfully";
  public static readonly MarkedForReworkMessage: string = "Data marked for rework successfully";
  public static readonly MarkedForPublishMessage: string = "Data marked for publishing successfully";
  public static readonly MarkedForRejectMessage: string = "Data marked for rework successfully";
  public static readonly PublishConfirmMessage: string = "Once submitted, portfolio company draft data will be published. Are you confirm?";
  public static readonly SectionDeselection: string = "Modified data will be removed on deselection";
}

export function GetFundcashflowTypes() {
  return [{name:FundCashflowConstants.Realised},{name:FundCashflowConstants.Unrealised},{name:FundCashflowConstants.Others},{name:FundCashflowConstants.All}]
}

export class CompanyPageSectionConstants {
  public static readonly CompanyInformation: string = "Static Information";
  public static readonly KPI: string = "Key Performance Indicator";
  public static readonly Financials: string = "Company Financials";
  public static readonly Commentary: string = "Commentary";
  public static readonly InvestmentProfessionals: string = "Investment Professionals";
  public static readonly Locations: string = "Geographic Locations";    
}
export class CommonPCConstants {
  public static readonly TaaboHost: string = "taabo-ch.beatfoliosure.com";
  public static readonly ExeterHost: string = "exeter.beatfoliosure.com";
  public static readonly LarissaHost: string = "larissa.beatfoliosure.com";
  public static readonly MonmouthHost: string = "monmouth.beatfoliosure.com";
  public static readonly PizarroHost: string  = "pizarro.beatfoliosure.com";
  public static readonly TrialHost: string  = "trial.beatfoliosure.com";
}
export class DealDetailsConstants {
  public static readonly DealCustomID = "DealCustomID";
  public static readonly FundName = "FundName";
  public static readonly CompanyName = "CompanyName";
  public static readonly Currency = "Currency";
  public static readonly InvestmentDate = "InvestmentDate";
  public static readonly EntryMultiple = "EntryMultiple";
  public static readonly EntryOwnershipPercent = "EntryOwnershipPercent";
  public static readonly CurrentExitOwnershipPercent = "CurrentExitOwnershipPercent";
  public static readonly EnterpriseValue = "EnterpriseValue";
  public static readonly EmployeeName = "EmployeeName";
  public static readonly LeadEmployeeName = "LeadEmployeeName";
  public static readonly BoardSeat = "BoardSeat";
  public static readonly ExitMethod = "ExitMethod";
  public static readonly InvestmentStage = "InvestmentStage";
  public static readonly SecurityType = "SecurityType";
  public static readonly DealSourcing = "DealSourcing";
  public static readonly TransactionRole = "TransactionRole";
  public static readonly ValuationMethodology = "ValuationMethodology";
  public static readonly DealStatus = "Status";
  public static readonly Customfield = "Customfield";
}
export class CompanyInformationConstants {
  public static readonly BusinessDescription: string = "BussinessDescription";
  public static readonly CompanyName: string = "CompanyName";
  public static readonly MasterCompanyName: string = "MasterCompanyName";
  public static readonly FundId: string = "FundId";
  public static readonly DealId: string = "DealId";
  public static readonly CompanyLogo: string = "CompanyLogo";
  public static readonly CompanyStatus: string = "Status";
  public static readonly StockExchange_Ticker: string = "StockExchange_Ticker";
  public static readonly Website: string = "Website";
  public static readonly Sector: string = "Sector";
  public static readonly SubSector: string = "SubSector"; 
  public static readonly FinancialYearEnd: string = "FinancialYearEnd";
  public static readonly IMPACT_KPI: string = "Impact KPI";
  public static readonly Currency: string = "Currency";
  public static readonly PROFIT_LOSS_KPI: string = "Profit & Loss KPI";
  public static readonly BALANCE_SHEET_KPI: string = "Balance Sheet KPI";
  public static readonly CASHFLOW_KPI: string = "Cashflow KPI";
  public static readonly TRADING_RECORDS: string = "Trading Records";
  public static readonly SignificantEvents: string = "Significant Events";
  public static readonly AssessmentPlan: string = "Assessment Vs Initial Plan";
  public static readonly ExitPlan: string = "Exits Plan";
  public static readonly ImpactHighlights: string = "Impact Highlights";
  public static readonly EmployeeName: string = "EmployeeName";
  public static readonly Email: string = "Email";
  public static readonly Designation: string = "Designation";
  public static readonly ContactNo: string = "ContactNo";
  public static readonly Education: string = "Education";
  public static readonly PastExperience: string = "PastExperience";
  public static readonly Region: string = "Region";
  public static readonly Country: string = "Country";
  public static readonly State: string = "State";
  public static readonly City: string = "City";
  public static readonly Customfield: string = "Customfield";
  public static readonly CompanyGroupId: string = "CompanyGroupId";
}

export class DealTrackRecordStatic {
  public static readonly Quarter: string = "Quarter";
  public static readonly InvestmentCost: string = "InvestmentCost";
  public static readonly RealizedValue: string = "RealizedValue";
  public static readonly UnrealizedValue: string = "UnrealizedValue";
  public static readonly TotalValue: string = "TotalValue";
  public static readonly Dpi: string = "Dpi";
  public static readonly Rvpi: string = "Rvpi";
  public static readonly GrossMultiple: string = "GrossMultiple";
  public static readonly GrossIRR: string = "GrossIRR";
  public static  readonly InvestmentDate:string="InvestmentDate";
  public static  readonly ValuationDate:string="ValuationDate";
  public static  readonly Status:string="Status";
  public static readonly Year: string = "Year";
  public static readonly Customfield = "Customfield";
}

export class M_Datatypes {
  public static readonly FreeText: number = 1;
  public static readonly CurrencyValue: number=3;
  public static readonly Number: number = 2;
  public static readonly Multiple: number=5;
  public static readonly Percentage: number=4;
  public static readonly Date: number=6;
  public static readonly List: number=7;
}

export class FundTrackRecordStatic {
  public static readonly Quarter: string = "Quarter";
  public static readonly Year: string = "Year";
  public static readonly TotalNumberOfInvestments: string = "TotalNumberOfInvestments";
  public static readonly RealizedInvestments: string = "RealizedInvestments";
  public static readonly UnRealizedInvestments: string = "UnRealizedInvestments";
  public static readonly TotalInvestedCost: string = "TotalInvestedCost";
  public static readonly TotalRealizedValue: string = "TotalRealizedValue";
  public static readonly TotalUnRealizedValue: string = "TotalUnRealizedValue";
  public static readonly TotalValue: string = "TotalValue";
  public static readonly Dpi: string = "Dpi";
  public static  readonly Rvpi:string="Rvpi";
  public static  readonly GrossMultiple:string="GrossMultiple";
  public static  readonly NetMultiple:string="NetMultiple";
  public static  readonly GrossIRR:string="GrossIRR";
  public static  readonly NetIRR:string="NetIRR";
  public static readonly Customfield = "Customfield";
  public static readonly FundSize = "FundSize";
  public static readonly InvestorStake = "InvestorStake";
  public static readonly InvestmentDate = "InvestmentDate";
  public static readonly CurrentExitOwnershipPercent = "CurrentExitOwnershipPercent";
  public static readonly CommitmentAfterAstreaTransfer = "CommitmentAfterAstreaTransfer";
  public static readonly CurrentEquityValueCalculated= "CurrentEquityValueCalculated";
}
export class FundInvestorConstants {
  public static readonly CommitmentDate: string = "CommitmentDate";
  public static readonly InvestorId: string = "InvestorId";
  public static readonly Commitment: string = "Commitment";
  public static readonly Ownership: string = "Ownership";
  public static readonly NetDrawn: string = "NetDrawn";
  public static readonly Recallable: string = "Recallable";
  public static readonly UndrawnCommitment: string = "UndrawnCommitment";
  public static readonly AstreaTransfer: string = "AstreaTransfer";
  public static readonly InvestorStake: string = "InvestorStake";
  public static readonly CommitmentAfterAstreaTransfer: string = "CommitmentAfterAstreaTransfer";
  public static readonly Customfield = "Customfield";
}

export class NumberDecimalConst {
  public static noDecimal: string = '1.0-0';
  public static singleDecimal: string = '1.0-1';
  public static currencyPercentMultiple: string = '1.1-1';
  public static doubleDecimal: string = '1.2-2';
  public static currencyDecimal: string = '1.1-1';
  public static multipleDecimal: string = '1.1-1';
  public static percentDecimal: string = '1.1-1';
}

export class InvestorStatic {
  public static readonly InvestorName: string = "InvestorName";
  public static readonly Website: string = "Website";
  public static readonly TotalCommitment: string = "TotalCommitment";
  public static readonly InvestorTypeId: string = "InvestorTypeId";
  public static readonly Customfield = "Customfield";
  public static readonly BusinessDescription = "BusinessDescription";
  public static readonly Region: string = "Region";
  public static readonly Country: string = "Country";
  public static readonly State: string = "State";
  public static readonly City: string = "City";
  public static readonly Headquarter: string="Headquarter";
}

export class GeoLocationStatic {
  public static readonly Region: string = "Region";
  public static readonly Country: string = "Country";
  public static readonly State: string = "State";
  public static readonly City: string = "City";
  public static readonly Headquarter: string="Headquarter";
}

export class InvestorDashBoardStatic {
  public static readonly InvestedCapital: string = "InvestedCapital";
  public static readonly TotalValue: string = "TotalValue";
  public static readonly RealizedValue: string = "RealizedValue";
  public static readonly UnRealizedValue: string = "UnRealizedValue";
  public static readonly TotalFunds: string="TotalFunds";
  public static readonly PortfolioCompanies: string="PortfolioCompanies";
  public static readonly Sectorwise:string="Sector Wise Investment";
  public static readonly Top10:string="Top 10 Portfolio Companies";
  public static readonly TVPIbyVintageYear:string="TVPI by Vintage Year"; 
}

export class FundPageSectionConstants {
  public static readonly StaticInformation: string = "Fund Details";
  public static readonly FundTerm: string = "Fund Terms";
  public static readonly TrackRecord: string = "Track Record"; 
  public static readonly GeoLocation: string = "Geographic Locations";             
}

export class FundStaticDetailConstants {
  public static readonly FundName: string = "FundName";
  public static readonly FirmName: string = "FirmName";
  public static readonly VintageYear: string = "VintageYear";
  public static readonly Currency: string = "Currency";
  public static readonly Sector: string = "Sector";
  public static readonly Strategy: string = "Strategy"; 
  public static readonly StrategyDescription: string = "StrategyDescription";
  public static readonly AccountType: string = "AccountType";
  public static readonly FundSize: string = "FundSize";
  public static readonly Investors: string = "Investors";
  public static readonly CustomField: string = "Customfield";    

}

export class FundTermFieldConstants {
  public static readonly ManagementFee: string = "ManagementFee";
  public static readonly TargetCommitment: string = "TargetCommitment";
  public static readonly GPCommitment: string = "GPCommitment";
  public static readonly PreferredReturnPercent: string = "PreferredReturnPercent";
  public static readonly CarriedInterestPercent: string = "CarriedInterestPercent";
  public static readonly MaximumExtensionToFundTerm: string = "MaximumExtensionToFundTerm";
  public static readonly MaximumCommitment: string = "MaximumCommitment";
  public static readonly GPCatchupPercent: string = "GPCatchupPercent";
  public static readonly Clawback: string = "Clawback";
  public static readonly ManagementFeeOffset: string = "ManagementFeeOffset";
  public static readonly FundClosingDate: string = "FundClosingDate";
  public static readonly FundTerm: string = "FundTerm";
  public static readonly OrgExpenses: string = "OrgExpenses";    
}
export class ValuationTable{
  public static readonly QuarterMonth: string="Quarter/Month";
  public static readonly CapitalCall:string ="CapitalCall";
  public static readonly CapitalDistribution: string="CapitalDistribution";
  public static readonly FeesAndExpenses: string="FeesAndExpenses";
  public static readonly UnrealizedGainOrLoss: string="UnrealizedGainOrLoss";
  public static readonly ClosingNAV: string="ClosingNAV";
  public static readonly CustomField: string = "Customfield"; 
}
export class InvestorCompanyPerformance{
public static readonly FundName ="FundName";
public static readonly FundSize  ="FundSize";
public static readonly CommitmentAfterAstreaTransfer ="CommitmentAfterAstreaTransfer";
public static readonly InvestorStake ="InvestorStake";
public static readonly InvestmentDate ="InvestmentDate";
public static readonly CurrentExitOwnershipPercent ="CurrentExitOwnershipPercent";
public static readonly CurrentEquityValueCalculated ="CurrentEquityValueCalculated";
public static readonly OriginalInvestedCapital ="OriginalInvestedCapital";
public static readonly OriginalRealizedValue  ="OriginalRealizedValue";
public static readonly OriginalUnrealizedValue ="OriginalUnrealizedValue";
public static readonly OriginalTotalValue ="OriginalTotalValue";
public static readonly InvestmentCost ="InvestmentCost";
public static readonly RealizedValue ="RealizedValue";
public static readonly UnrealizedValue ="UnrealizedValue";
public static readonly TotalValue ="TotalValue";
public static readonly Dpi ="Dpi";
public static readonly Rvpi ="Rvpi";
public static readonly GrossMultiple ="GrossMultiple";
public static readonly GrossIRR ="GrossIRR";
public static readonly  Status="Status";
}    

export class FinancialsSubTabs {
  public static Actual: string = 'Actual';
  public static Budget: string = 'Budget';
  public static Forecast: string = 'Forecast';
  public static IC: string = 'IC';
}
export class TopHoldings{
  public static PortfolioCompany:string="Portfolio Company";
  public static Fund:string="Fund";
  public static Status:string="Status";
  public static TopHoldingByMostInvested:string = "Holdings By Most Invested";
  public static TopHoldingsByCompanyValuation:string = "Holdings By Company Valuation";
  public static TopHoldingsByGrossTvpi:string = "Holdings By Gross TVPI";
}

export class KpiInfo {
  public static Number: string = '#';
  public static Percentage: string = '%';
  public static Currency: string = '$';
  public static Multiple: string = 'x';
  public static Text: string = 'Text';
}

export class ModuleList {
  public static User: string = 'user';
  public static Firm: string = 'firm';
  public static Deal: string = 'deal';
  public static Fund: string = 'fund';
  public static Company: string = 'portfolio company';
  public static CompanyKpi: string = 'company kpi';
  public static Financials: string = 'financials';
  public static ImpactKpi: string = 'impact kpi';
  public static InvestmentKpi: string = 'investment kpi';
  public static MonthlyReport: string = 'monthly report';
  public static OperationalKpi: string = 'operational kpi';
  public static ExchangeRates: string = 'exchange rates';
  public static TradingRecords: string = 'trading records';
  public static CreditKpi: string = 'credit kpi';
  public static ValuationTable: string = 'valuation table';
  public static Adhoc: string = 'adhoc';
  public static Investor: string = 'investor';
  public static FOF: string = 'fund beta';
  public static ESG: string = 'esg';
}

export class KpiTypes{
  public static Company = {name:"Company", type:"CompanyKPIs"}
  public static TradingRecords= {name:"Trading Records", type:"TradingRecords"} ; 
  public static TradingRecordsBeta= {name:"Trading Records Beta", type:"TradingRecords"} ;
  public static OperationalBeta= {name:"Operational KPI Beta", type:"OperationalKPIs"} ;  
  public static Operational= {name:"Operational", type:"OperationalKPIs"} ;  
}

export class PeriodTypeFilterOptions{
  public static Monthly: string = "Monthly";
  public static Quarterly: string = "Quarterly" ;
  public static Annual: string = "Annual";
}

export class PeriodType{
  public static filterOptions: any[] = [
    { field: PeriodTypeFilterOptions.Monthly, key: false},
    { field: PeriodTypeFilterOptions.Quarterly, key: false },
    { field: PeriodTypeFilterOptions.Annual, key: false }
  ];
    }
export class Constants{
  public static  DealTrackRecord:string="Portfolio Company Fund Holding Details";
  public static  InvestmentProfessionals:string="Investment Professionals";
  public static  HeaderSuccessMessage:string="Company Equity Calculation Details headers successfully changed";
  public static  ContentTitle:string="Values to be subtracted should be entered as negative value\nE.g. -450000";
}
export class FileUploadStatus{
  public static  FOF:string="Fund of Fund";
  public static  ESG:string="ESG";
  public static  errorMessage:string="errorMessage";
  public static  UploadinProgress:string="Upload in progress";
  public static  UploadSuccessful:string="Upload successful"; 
  public static  UploadFailed:string="Upload failed";
  public static  UploadCancelled:string="Upload Cancelled";
  public static  FileUploadProcessImage:string="assets/dist/images/file-upload-process.svg";
  public static  FileUploadSuccessImage:string="assets/dist/images/file-upload-success.svg";
  public static  FileUploadErrorCountImage:string="assets/dist/images/error-count.svg";
  public static  FileUploadFailedImage:string="assets/dist/images/file-upload-failed.svg";
  public static  FileUploadCrossGreyImage:string="assets/dist/images/CrossGrey.svg";
  public static  FileUploadNotificIconImage:string= "assets/dist/images/NotificIcon.svg";;
  public static  FileUploadHeaderName:string="headerName";
  public static  FileUploadBulkMessage:string="bulkMessage";
  public static  FileUploadInvokeFileStatusByUserId:string="InvokeFileStatusByUserId";
  public static  FileUploadFileStatusUpdated:string="FileStatusUpdated";
  public static  FileUploadNotification:string="file-upload-notification";
  public static  FileUploadFileuploadStatus:string="/fileuploadstatus";
  public static  FileUploadDummyRoute:string="/dummy";
  
}