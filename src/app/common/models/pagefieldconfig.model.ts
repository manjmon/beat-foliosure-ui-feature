export class  PageConfigFieldModel {
    name : string
    displayName: string;
    value : string;
    isMandatory : boolean = false;
    isActive : boolean;
    dataTypeId:number;
}
export class  PCCustomListFieldModel {
    groupId:number=0;
    groupName : string
    isActive : boolean;
    displayOrder:number;
    featureId:number;
    fieldId:number;
    isEditable:boolean=false;
}
