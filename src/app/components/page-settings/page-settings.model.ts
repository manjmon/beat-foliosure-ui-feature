export interface SubPageDetailModel {
    id: number,
    displayName: string,
    parentId: number,
    name: string,
    description: string,
    isActive: boolean,
    isDeleted: boolean,
    encryptedID: null,
    sequenceNo: string,
    pagePath: string,
    isCustom: boolean,
    dataTypeId:number;
    isDragDrop:boolean;
    isListData:boolean;
    showOnList:boolean;
}

export interface SubPageFieldList {
    id: number;
    displayName: string;
    parentId: number;
    name: string;
    description?: any;
    isActive: boolean;
    isDeleted: boolean;
    encryptedID?: any;
    sequenceNo: number;
    pagePath?: any;
    isCustom: boolean;
    createdOn: Date;
    createdBy: number;
    modifiedOn?: any;
    modifiedBy?: any;
    isListData:boolean;
    showOnList:boolean;
}

export interface RootObjectPageSettings {
    id: number;
    displayName: string;
    parentId: number;
    name: string;
    description?: any;
    isActive: boolean;
    isDeleted: boolean;
    encryptedID?: any;
    sequenceNo?: any;
    pagePath?: any;
    isCustom: boolean;
    isExpanded: boolean;
    isDynamicFieldSupported: boolean;
    subPageFieldList: SubPageFieldList[];
    createdOn: Date;
    createdBy: number;
    modifiedOn?: any;
    modifiedBy?: any;
    isTabExpanded: boolean;
    isCustomFieldSupported: boolean;
}

