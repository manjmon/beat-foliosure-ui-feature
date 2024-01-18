import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, } from "@angular/core";
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { SubPageDetailModel } from '../page-settings/page-settings.model'
import { ComponentCanDeactivate } from 'src/app/unsaved-changes/can-deactivate/component-can-deactivate';
import { ConfirmLeaveComponent } from '../../components/page-settings/confirm-leave-component/confirm-leave.component';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PageConfigurationPageDetails } from 'src/app/common/enums';
@Component({
  selector: 'app-page-configuration',
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss']
})
export class PageSettingsComponent extends ComponentCanDeactivate implements OnInit {
  @ViewChild('f', { static: true }) ngform: NgForm;
  @ViewChild('f')
  form: NgForm;
  pageList: any = [];
  pageListClone: any = [];
  subPageList: any = [];
  subPageListClone: any = [];
  selectedPageItem: any = {};
  pageDropdownOptions: any = [];
  isAddFieldButtonClicked: boolean = false;
  @ViewChildren("sectioncontent") sectioncontent: QueryList<ElementRef>;
  @ViewChild('f') f: FormGroupDirective;
  subPageDetailmodel: SubPageDetailModel;
  isLoader: boolean = false;
  lastSelectedPageItem: any = {};
  filterDelete: any = { isDeleted: false };
  existingTags = [];
  isPopup = false;
  modalTitle = "Confirmation"
  isSaveChagesOldCount = 0;
  onChagelastSelectedPageItem: any = {};
  isDisabledBtn: boolean = true;
  trackrecordDataTypes = [];
  pcDataTypes = [];
  pageConfigurationsDatalist = [];
  temp: number;
  disablePageList = false;
  currentModelRef: any;
  status: boolean = false;
  kpiSubPageId: number = 2;
  financial: number = 3;
  pageConfigurationPageDetails = PageConfigurationPageDetails;
  disabled: boolean;
  inputSwitchElement: any;
  onChange: any;
  constructor(private modalService: NgbModal, private pageConfigurationService: PageConfigurationService, private router: Router, private fb: FormBuilder, private toastrService: ToastrService) {
    super();
  }
  ngOnInit() {
    this.getConfiguration();
    this.ngform.valueChanges.subscribe(() => {
    });
    this.getTrackrecordDataTypes();
  }
  getTrackrecordDataTypes() {
    this.pageConfigurationService.getTrackrecordDataTypes().subscribe((result) => {
      this.pcDataTypes = result.pageConfigurations;
      this.trackrecordDataTypes = result.pageConfigurations.filter(function (el) { return el.dataType != "List"; });
      this.pageConfigurationsDatalist = result.pageConfigurationsDatalist;
    });
  }
  canDeactivate(): boolean {
    return !this.form.form.valid || this.isDisabledBtn
  }

  localCanDeactivate(): boolean {
    return !this.form.form.valid || this.isDisabledBtn
  }
  OnCancel(e: any) {
    this.isPopup = false;
  }
  OnConfig(e: any) {
    this.save();
  }
  loadpopup() {
    this.isPopup = true;
  }
  ngAfterViewInit() {
    this.sectioncontent.changes.subscribe(() => {
      this.sectioncontent.forEach(row => {
        let inputTextEle = row.nativeElement.querySelector('[type=text]');
        let labelEle = row.nativeElement.querySelector('label');
        inputTextEle.addEventListener('focus', () => {
          labelEle.classList.toggle('active');
        });
        inputTextEle.addEventListener('blur', () => {
          labelEle.classList.toggle('active');
        });
      });
      if (this.sectioncontent && this.sectioncontent.last) {
        (this.isAddFieldButtonClicked && this.sectioncontent.last.nativeElement.querySelector('[type=text]').focus());
        this.isAddFieldButtonClicked = false;
      }
    });
  }
  checkAnyDataChange() {
    if (JSON.stringify(this.subPageListClone) !== JSON.stringify(this.subPageList)) {
      this.isDisabledBtn = false;
    } else {
      this.isDisabledBtn = true;
    }
  }
 
  getConfiguration() {
    this.isLoader = true;
    this.pageConfigurationService.getPageConfiguration()
      .subscribe({
        next:(result: any) => {
          this.parseJsonResponse(result);
          this.refreshSubPageDetailList();
          this.checkAnyDataChange();
          this.isLoader = false;
        }, error:(error) => {
          this.isLoader = false;
        }});
  }

  onToggleChange(isActive, j, i, isTabExpanded) {
    this.subPageList[i].subPageFieldList[j].isActive = !isActive;
    this.subPageListClone[i].isTabExpanded = isTabExpanded;
    this.checkAnyDataChange();
  }

  onListToggleChange(isListData, j, i, isTabExpanded) {
    this.subPageList[i].subPageFieldList[j].isListData = isListData;
    this.subPageListClone[i].isTabExpanded = isTabExpanded;
    if (this.selectedPageItem != undefined && this.selectedPageItem.name == "Funds" || this.selectedPageItem.name == "Portfolio Company") {
      let list = this.subPageList[i].subPageFieldList.filter(x => x.isListData);
      this.checkListPageToggle(list);
    } else {
      this.disablePageList = false;
    }
    this.checkAnyDataChange();
  }

  checkListPageToggle(list) {
    if (list != undefined && list.length >= 4) {
      this.disablePageList = true;
    } else {
      this.disablePageList = false;
    }
  }

  parseJsonResponse = (result: any[]) => {

    if ((result == null || undefined)) return;
    this.pageList = result;
    this.pageListClone = JSON.parse(JSON.stringify(this.pageList));;
    this.pageDropdownOptions = this.pageList.filter(x => x.isActive).map(x => ({ id: x.id, name: x.name, displayName: x.displayName }));
    this.selectedPageItem = this.pageDropdownOptions[0];
    if (Object.keys(this.lastSelectedPageItem).length != 0) {
      this.selectedPageItem = this.lastSelectedPageItem;
    }
    this.onChagelastSelectedPageItem = this.selectedPageItem;
    let list = result[0].subPageDetailList[0].subPageFieldList.filter(x => x.isListData);
    this.checkListPageToggle(list);
  }
  addCustomField = (item) => {
    this.isAddFieldButtonClicked = true;
    let subpaseId = item.id;
    let subSection = this.subPageList.find(x => x.id == item.id);
    this.subPageDetailmodel = <SubPageDetailModel>{};
    this.subPageDetailmodel.id = 0;
    this.subPageDetailmodel.displayName = null;
    this.subPageDetailmodel.parentId = subpaseId;
    this.subPageDetailmodel.name = "Customfield";
    this.subPageDetailmodel.description = null;
    this.subPageDetailmodel.isActive = true;
    this.subPageDetailmodel.isDeleted = false;
    this.subPageDetailmodel.encryptedID = null;
    this.subPageDetailmodel.sequenceNo = subSection.subPageFieldList[subSection.subPageFieldList.length - 1].sequenceNo + 1;
    this.subPageDetailmodel.pagePath = null;
    this.subPageDetailmodel.isCustom = true;
    this.subPageDetailmodel.dataTypeId = item.isDataType ? null : 0;
    this.subPageDetailmodel.showOnList = (item.id != 1 && item.id !== 7) ? false : true;
    this.subPageDetailmodel.isListData = (item.id != 1 && item.id !== 7) ? false : item.isListData;
    subSection.subPageFieldList.push(this.subPageDetailmodel);
    this.isSaveChagesOldCount++;
    this.addTags(subSection.subPageFieldList, false);
    if (!item.isTabExpanded)
      this.onTabToggle(item);

  }
  removeCustomField = (currentItem, removeFieldItem) => {
    let subSection = this.subPageList.find(x => x.id == currentItem.id);
    let sunsectionClone = this.subPageListClone.find(x => x.id == currentItem.id);
    if (removeFieldItem.displayName == null) {
      subSection.subPageFieldList = subSection.subPageFieldList.filter(x => x.sequenceNo != removeFieldItem.sequenceNo);
      sunsectionClone.subPageFieldList = sunsectionClone.subPageFieldList.filter(x => x.sequenceNo != removeFieldItem.sequenceNo);
      this.isSaveChagesOldCount = this.isSaveChagesOldCount - 1;
    }
    if (removeFieldItem.displayName != null) {
      let objIndex = subSection.subPageFieldList.findIndex((obj => obj.displayName == null ? obj.sequenceNo == removeFieldItem.sequenceNo : obj.displayName == removeFieldItem.displayName));
      subSection.subPageFieldList[objIndex].isDeleted = true;

      let objIndexclone = sunsectionClone.subPageFieldList.findIndex((obj => obj.displayName == null ? obj.sequenceNo == removeFieldItem.sequenceNo : obj.displayName == removeFieldItem.displayName));
      sunsectionClone.subPageFieldList[objIndexclone].isDeleted = true;

      if (this.isSaveChagesOldCount > 0)
        this.isSaveChagesOldCount = this.isSaveChagesOldCount - 1;
    }
    this.checkAnyDataChange();

  }
  onKeyup(item) {
    let subSection = this.subPageList.find(x => x.id == item.id);
    this.addTags(subSection.subPageFieldList, false);
    this.hotFixForRecentChangesButtonEnabledDisable(item, subSection);
  }
  hotFixForRecentChangesButtonEnabledDisable(item, subSection) {
    let subSectionClone = this.subPageListClone.find(x => x.id == item.id);
    subSectionClone.isTabExpanded = subSection.isTabExpanded;
  }
  
  onTabToggle = (currentItem: any) => {
    this.subPageList.filter(x => x.id != currentItem.id).forEach(x => x.isTabExpanded = false);
    currentItem.isTabExpanded = (!currentItem.isTabExpanded);
    this.addTags([], false);
  }
  collectionHas(a, b) {
    for (let i = 0, len = a.length; i < len; i++) {
      if (a[i] == b) return true;
    }
    return false;
  }
  findParentBySelector(elm, selector) {
    let all = document.querySelectorAll(selector);
    let cur = elm.parentNode;
    while (cur && !this.collectionHas(all, cur)) {
      cur = cur.parentNode;
    }
    return cur;
  }
  refreshSubPageDetailList = () => {
    if (this.pageList.length > 0) {
      let subPageDetailList = this.pageList.find(x => x.id == this.selectedPageItem.id).subPageDetailList;
      this.subPageList = subPageDetailList.map(x => Object.assign(x, { isTabExpanded: false, isCustomFieldSupported: false }));
      this.subPageListClone = JSON.parse(JSON.stringify(this.subPageList));
      this.isSaveChagesOldCount = 0;

      if (this.selectedPageItem != undefined && this.selectedPageItem.name == "Funds" || this.selectedPageItem.name == "Portfolio Company") {
        let list = this.subPageList[0].subPageFieldList.filter(x => x.isListData);
        this.checkListPageToggle(list);
      } else {
        this.disablePageList = false;
      }
    }
  }
  addTags(subPageList: any[], isPage: boolean) {
    this.existingTags = [];
    if (isPage) {
      if (subPageList.length > 0) {
        subPageList.forEach(element => {
          this.existingTags.push(element.displayName.toLowerCase());
          element?.subPageFieldList.forEach(value => {
            if (value.displayName != null)
              this.existingTags.push(value.displayName.toLowerCase());
          });
        });
      }
    }
    if (!isPage) {
      if (subPageList.length > 0) {
        subPageList.forEach(value => {
          if (value.displayName != null)
            this.existingTags.push(value.displayName.toLowerCase())
        });
      }
    }
  }
  isexits: any = 0;
  exitsCheckDisplayName(i, value) {
    if (value.length != 0) {
      let status = this.existingTags.indexOf(value.toLowerCase()) > -1;
      if (status)
        this.isexits = i;
      else
        this.isexits = 0;
    } else
      this.isexits = 0;
  }

  onPageDdSelectionChange = (event) => {

    this.isLoader = true;
    if (event.value != undefined) {
      this.selectedPageItem = event.value;
      if (event.value.name == "Funds" || event.value.name == "Portfolio Company") {
        let list = this.subPageList[0].subPageFieldList.filter(x => x.isListData);
        this.checkListPageToggle(list);
      } else {
        this.disablePageList = false;
      }
    }
    this.lastSelectedPageItem = event.value;
    if (!this.localCanDeactivate()) {
      const modalRef = this.modalService.open(
        ConfirmLeaveComponent, { 
          windowClass : "myCustomModalClass",
          backdrop : false,
          keyboard : false}
      );
      modalRef.componentInstance.onSave.subscribe((result: any) => {
        if(result != null && result) {
          this.pageList = JSON.parse(JSON.stringify(this.pageListClone));
          this.refreshSubPageDetailList();
          this.checkAnyDataChange();
        }
        else {
          this.pageDropdownOptions = this.pageList.filter((x:any) => x.isActive).map((x:any) => ({ id: x.id, name: x.name, displayName: x.displayName }));
          this.selectedPageItem = this.pageDropdownOptions.find((x:any) => x.id == this.onChagelastSelectedPageItem.id);
        }
      })
    } else {
      this.refreshSubPageDetailList();
      this.checkAnyDataChange();
    }
    this.isLoader = false;
  }

  reset = () => {
    this.getConfiguration();
  }
  save = () => {
    this.subPageList.forEach(element => {
      let hiddenfield = element?.subPageFieldList.filter(x => !x.isActive);
      if (element?.subPageFieldList?.length == hiddenfield.length&&element.parentId != this.pageConfigurationPageDetails.ESG) {
        element.isActive = false;
      }
      else {
        if (element.parentId != this.pageConfigurationPageDetails.ESG) {
          element.isActive = true;
        }
      }
    });

    this.pageConfigurationService.pageConfigurationSaveData(this.subPageList).subscribe({
      next:result => {
      if (result != null) {
        let message = result.message;
        if (result.code != "error")
          this.toastrService.success(` Page Configuration ${result.message.toLowerCase()} successfully`, "", { positionClass: "toast-center-center" });
        else
          this.toastrService.error(`${message}`, "", { positionClass: "toast-center-center" });
        this.isPopup = false;
        this.getConfiguration();
      }
    }, error:(error) => {
      if (error.status == 500)
        this.toastrService.error(`Empty fields are not allowed`, "", { positionClass: "toast-center-center" });
    }})
  }
  createCopy(orig) {
    return JSON.parse(JSON.stringify(orig))
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else if (event.previousIndex !== event.currentIndex) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.temp = event.previousIndex;
        event.previousIndex = event.currentIndex;
        event.currentIndex = this.temp;
        const subPageID = event.container.data[event.currentIndex]["subPageID"];
        const currentID = event.container.data[event.currentIndex]["id"];
        const previousID = event.container.data[event.previousIndex]["id"];
        if (currentID != 0 && previousID != 0) {
          let localSubpage: any = event.container.data;
          let subSection = this.subPageList.find(x => x.id == subPageID);
          let subSectionClone = this.subPageListClone.find(x => x.id == subPageID);
          subSectionClone.isTabExpanded = subSection.isTabExpanded;
          let objIndexCurrent = subSection.subPageFieldList.findIndex((obj => obj.id == currentID));
          subSection.subPageFieldList[objIndexCurrent].sequenceNo = localSubpage.find(x => x.id == currentID).sequenceNo;
          let objIndexPrevious = subSection.subPageFieldList.findIndex((obj => obj.id == previousID));
          subSection.subPageFieldList[objIndexPrevious].sequenceNo = localSubpage.find(x => x.id == previousID).sequenceNo;
        }
      }
    }
    this.checkAnyDataChange();
  }
  onToggleChartChange(isChart: any, j: string | number, i: string | number, isTabExpanded: any) {
    this.subPageList[i].subPageFieldList[j].isChart = !isChart;
    this.subPageListClone[i].isTabExpanded = isTabExpanded;
    this.checkAnyDataChange();
  }
  onChangeSubPageFields(event, j: number, i: number, isTabExpanded: any) {
    this.subPageListClone[i].isTabExpanded = isTabExpanded;
    this.checkAnyDataChange();
  }
  onMainCardToggleChange(isActive, isTabExpanded, i: number) {
    this.subPageList[i].isActive = !isActive;
    this.subPageListClone[i].isTabExpanded = isTabExpanded;
    this.checkAnyDataChange();
  } 
}
