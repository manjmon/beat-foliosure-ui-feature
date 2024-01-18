export interface WorkflowInfo {
    workflowRequestId:number;
    statusId:number;
    draftName:string;
    statusName:string;
    isDiscard:boolean;
    isSubmit:boolean;
    isReset:boolean;
    totalMarked:number;
    totalRework:number;
    totalApproved:number;
    isActionButtons:boolean;
    isPublished:boolean;
    isRejected:boolean;
    isStart:boolean;
    isEnd:boolean;
}
export interface WorkflowSectionInfo {
    subFeatureId:number;
    subFeatureName:string;
    isMarkedForReview:boolean;
    hasMarkedForReview:boolean;
    isActionButtons:boolean;
    isPublishAction:boolean;
    hasApprove:boolean;
    hasRework:boolean;
    isRework:boolean;
    isApprove:boolean
    hasPublish:boolean;
    hasReject:boolean;
    isEdited:boolean;
    statusId:number;
    currentStatus:string;
    workflowRequestId:number;
    workflowMappingId:number;
}

export interface WorkflowCompanyStaticModel {
    Name : string
    DisplayName: string;
    Value : string;
    IsActive : boolean
}
