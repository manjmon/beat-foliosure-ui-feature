import { Component, EventEmitter, Input, OnInit, Output, ElementRef, Renderer2 } from "@angular/core";
import { PCCustomListFieldModel } from "src/app/common/models/pagefieldconfig.model";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { MatMenuTrigger } from "@angular/material/menu";
@Component({
    selector: "add-portfolioCustomFields",
    templateUrl: "./portfolioCustomFields.component.html",
    styleUrls: ['./portfolioCustomFields.component.scss']
})
export class PortfolioCustomFieldsComponent implements OnInit {
    @Input() indexFieldId: any;
    @Input() fieldId: any;
    @Input() groupList: PCCustomListFieldModel[] = [];
    @Input() displayName: any;
    @Input() companyId: any;
    @Output() updateList: EventEmitter<any> = new EventEmitter<any>()
    searchGroup: string = "";
    groupName: string = "";
    copyEditGroupName: string = "";
    groupObj: PCCustomListFieldModel;
    @Input() menuTrigger: MatMenuTrigger;
    constructor(private portfolioCompanyService: PortfolioCompanyService, private elRef: ElementRef, private renderer: Renderer2) {

    }
    ngOnInit(): void {
        this.companyId = this.companyId == undefined ? 0 : this.companyId;
        this.getCompanyCustomList(this.companyId);
    }
    getCompanyCustomList = (pcId: any) => {
        if (pcId != undefined) {
            this.portfolioCompanyService.getCompanyCustomList(pcId, this.fieldId)
                .subscribe({
                    next:(result: any) => {
                        if (result != null && result.length > 0) {
                            this.groupList = result;
                        } else
                            this.groupList = [];
                    }, error:(_error) => {
                        this.groupList = [];
                    }});
        } else
            this.groupList = [];
    }
    myFunc(event) { event.stopPropagation(); }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.groupList, event.previousIndex, event.currentIndex);
        this.groupList.forEach(_ => {
            _.displayOrder = this.groupList.indexOf(_);
        });
        this.changesUpdateList(this.groupList);
    }
    editGroup = (group) => {
        this.copyEditGroupName = group.groupName;
        group.isEditable = true;
    }
    deleteGroup = (group) => {
        const objIndex = this.groupList.findIndex((obj => obj.displayOrder == group.displayOrder));
        if (objIndex != -1) {
            this.groupList[objIndex].isActive = true;
        }
        this.changesUpdateList(this.groupList);
    }
    updateGroup = (group) => {
        if (group.groupName == null || group.groupName == "") return;
        if (this.groupList.some(x => !x.isEditable && !x.isActive && x.groupName == group.groupName)) return;
        const objIndex = this.groupList.findIndex((obj => obj.displayOrder == group.displayOrder));
        if (objIndex != -1) {
            this.groupList[objIndex].groupName = group.groupName
            this.groupList[objIndex].isEditable = false;
            this.groupName = "";
        }
        this.changesUpdateList(this.groupList);
    }
    addCompanyGroup = () => {
        if (this.groupName == null || this.groupName == "") return;
        if (this.groupList.some(x => x.groupName == this.groupName && !x.isActive)) return;
        this.groupObj = <PCCustomListFieldModel>{}
        this.groupObj.featureId = (this.companyId == undefined ? 0 : this.companyId);
        this.groupObj.fieldId = this.fieldId;
        this.groupObj.groupId = 0;
        this.groupObj.isEditable = false;
        this.groupObj.isActive = false;
        this.groupObj.groupName = this.groupName;
        this.groupObj.displayOrder = this.groupList?.length == 0 || this.groupList == null ? 1 : this.groupList?.length + 1;
        this.groupObj.groupName = this.groupName;
        this.groupList.push(this.groupObj)
        this.groupName = "";
        this.changesUpdateList(this.groupList);
    }
    changesUpdateList = (groupList: PCCustomListFieldModel[] = []) => {
        this.updateList.emit(groupList);
    }
    closePanel() {
        let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
        element.click();
    }
    cancelClick = (group) => {
        if (this.copyEditGroupName != group.groupName)
            group.groupName = this.copyEditGroupName;
        group.isEditable = false;
        this.copyEditGroupName = "";
    }
}