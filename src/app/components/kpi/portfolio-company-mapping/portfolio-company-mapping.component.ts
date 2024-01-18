import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ElementRef, ViewChild, OnInit, Input, AfterViewInit, Output, EventEmitter, ViewEncapsulation,Renderer2 } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { KpiTypesConstants } from "src/app/common/constants";
/**
 * Node for to-do item
 */
export class KPIItemNode {
    children: KPIItemNode[];
    id: string;
    name: string;
    isMapped: boolean;
    isBoldKPI: boolean;
    isHeader: boolean;
    parentKPIID: number;
    displayOrder: number;
    oldDisplayOrder: number;
    oldIsMapped: boolean;
    mappingKPIId: number;
    formula: string;
    formulaKPIId: string;
    kpiInfo: string;
}

/** Flat to-do item node with expandable and level information */
export class KPIItemFlatNode {
    id: string;
    name: string;
    isMapped: boolean;
    isBoldKPI: boolean;
    isHeader: boolean;
    parentKPIID: number;
    displayOrder: number;
    oldDisplayOrder: number;
    level: number;
    expandable: boolean;
    mappingKPIId: number;
    oldIsMapped: boolean;
    children: KPIItemNode[];
    formula: string;
    formulaKPIId: string;
    kpiInfo: string;
}
@Injectable()
export class ChecklistDatabase {
    dataChange = new BehaviorSubject<KPIItemNode[]>([]);

    get data(): KPIItemNode[] { return this.dataChange.value; }

    constructor() {
        // constructor
    }

    initialize(treeitem) {
        const data = this.buildFileTree(treeitem, 0);
        this.dataChange.next(data);
    }
    buildFileTree(obj: { [key: string]: any }, level: number, parentId: string = '0'): KPIItemNode[] {
        return Object.keys(obj).reduce<KPIItemNode[]>((accumulator, key, idx) => {
            const value = obj[key];
            const node = new KPIItemNode();
            node.name = value.name;
            node.id = value.id;
            node.isMapped = value.isMapped;
            node.isBoldKPI = value?.isBoldKPI;
            node.isHeader = value?.isHeader;
            node.parentKPIID = value.parentKPIID;
            node.displayOrder = value.displayOrder;
            node.mappingKPIId = value.mappingKPIId;
            node.oldIsMapped = value.oldIsMapped;
            node.oldDisplayOrder = value.oldDisplayOrder;
            node.formula = value.formula;
            node.formulaKPIId = value.formulaKPIId;
            node.kpiInfo = value.kpiInfo;
            if (value.children != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value.children, level + 1);
                } else {
                    node.name = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

    /** Add an item to to-do list */
    insertItem(parent: KPIItemNode, node: any): KPIItemNode {
        if (!parent.children) {
            parent.children = [];
        }
        const newItem = node as KPIItemNode;
        parent.children.push(newItem);
        this.dataChange.next(this.data);
        return newItem;
    }
    insertNewItem(node: any): KPIItemNode {
        const newItem = node as KPIItemNode;
        this.data.splice(this.data.length + 1, 0, newItem);
        this.dataChange.next(this.data);
        return newItem;
    }

    insertItemAbove(node: KPIItemNode, nodenew: any): KPIItemNode {
        const parentNode = this.getParentFromNodes(node);
        const newItem = nodenew as KPIItemNode;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node), 0, newItem);
        } else {
            this.data.splice(this.data.indexOf(node), 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }

    insertItemBelow(node: KPIItemNode, nodeNew: any): KPIItemNode {
        const parentNode = this.getParentFromNodes(node);
        const newItem = nodeNew as KPIItemNode;
        if (parentNode != null) {
            parentNode.children.splice(parentNode.children.indexOf(node) + 1, 0, newItem);
        } else {
            this.data.splice(this.data.indexOf(node) + 1, 0, newItem);
        }
        this.dataChange.next(this.data);
        return newItem;
    }

    getParentFromNodes(node: KPIItemNode): KPIItemNode {
        for (let i = 0; i < this.data.length; ++i) {
            const currentRoot = this.data[i];
            const parent = this.getParent(currentRoot, node);
            if (parent != null) {
                return parent;
            }
        }
        return null;
    }

    getParent(currentRoot: KPIItemNode, node: KPIItemNode): KPIItemNode {
        if (currentRoot.children && currentRoot.children.length > 0) {
            for (let i = 0; i < currentRoot.children.length; ++i) {
                const child = currentRoot.children[i];
                if (child === node) {
                    return currentRoot;
                } else if (child.children && child.children.length > 0) {
                    const parent = this.getParent(child, node);
                    if (parent != null) {
                        return parent;
                    }
                }
            }
        }
        return null;
    }

    updateItem(node: KPIItemNode, newNode: any) {
        node = newNode;
        this.dataChange.next(this.data);
    }

    deleteItem(node: KPIItemNode) {
        this.deleteNode(this.data, node);
        this.dataChange.next(this.data);
    }

    copyPasteItem(from: KPIItemNode, to: KPIItemNode): KPIItemNode {
        this.insertItem(to, from);
        return to;
    }

    copyPasteItemAbove(from: KPIItemNode, to: KPIItemNode): KPIItemNode {
        this.insertItemAbove(to, from);
        return to;
    }

    copyPasteItemBelow(from: KPIItemNode, to: KPIItemNode): KPIItemNode {
        this.insertItemBelow(to, from);
        return to;
    }

    deleteNode(nodes: KPIItemNode[], nodeToDelete: KPIItemNode) {
        const index = nodes.indexOf(nodeToDelete, 0);
        if (index > -1) {
            nodes.splice(index, 1);
        } else {
            nodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                    this.deleteNode(node.children, nodeToDelete);
                }
            });
        }
    }
}
@Component({
    selector: 'app-portfolio-company-mapping',
    templateUrl: './portfolio-company-mapping.component.html',
    styleUrls: ['./portfolio-company-mapping.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ChecklistDatabase]
})
export class PortfolioCompanyMappingComponent implements OnInit, AfterViewInit {
    selectedKpiType = { name: KpiTypesConstants.TRADING_RECORDS, field: 'TradingRecords', moduleID: 1 };
    kpiType: string = KpiTypesConstants.TRADING_RECORDS;
    @Input() kpiTypes = null;
    companyList: any = [];
    @Input() moduleID: number = null;
    @Input() reload: any;
    selectedCopyToCompanyList: any = [];
    @Output() OnCopyCompanyEmit: EventEmitter<any> = new EventEmitter();
    kpiList = [];
    listKPIList:any = [];
    companyId: string;
    kpiTreeList = [];
    kpiName: string;
    allKpiName:string;
    isHierarchy: boolean = true;
    isCheckedAll: boolean = true;
    isCancelPopup: boolean = false;
    isSavePopup: boolean = false;
    isDisabledCancelBtn = true;
    disableCopyTo = false;
    isDisabledSaveBtn = true;
    isLoader: boolean = false;
    isMapAlertPopup: boolean = false;
    isUnMapped: boolean = false;
    isMappingContinue = false;
    treeHeight: any;
    kpilistheight: any;
    filteredTreeData = [];
    currentselectedthread: KPIItemNode[] = [];
    SearchSelectedTreeData: any[];
    clonekpiTreeList = [];
    isCheck = "N";
    PreviousSelectedTreedata: any;
    searchDataList = [];
    selectedFormulaKPI:any = null;
    flatNodeMap = new Map<KPIItemFlatNode, KPIItemNode>();
    nestedNodeMap = new Map<KPIItemNode, KPIItemFlatNode>();
    selectedParent: KPIItemFlatNode | null = null;
    Emptyischeck: boolean = true;
    /** The new item's name */
    newItemName = '';

    treeControl: FlatTreeControl<KPIItemFlatNode>;

    treeFlattener: MatTreeFlattener<KPIItemNode, KPIItemFlatNode>;

    dataSource: MatTreeFlatDataSource<KPIItemNode, KPIItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<KPIItemFlatNode>(true /* multiple */);

    /* Drag and drop */
    dragNode: any;
    allListHidden = true;
    kpiAllListItem:any;
    filteredAllKpiList: string[] = [];
    dragNodeExpandOverWaitTimeMs = 50;
    dragNodeExpandOverNode: any;
    dragNodeExpandOverTime: number;
    dragNodeExpandOverArea: string;
    @ViewChild('emptyItem') emptyItem: ElementRef;
    @ViewChild(ToastContainerDirective, {})
    toastContainer: ToastContainerDirective;
    isOpenPopUp: boolean = false;
    isEnableView: boolean;
    selectedCompany: any[] = [];
    deletedMappedkpi: any = [];
    portfolioCompanyList:any=[];
    @ViewChild('searchKpiButton') searchKpiButton: ElementRef;
    @ViewChild('searchKpiModal') searchKpiModal: ElementRef;
    OriginalKpiList: any;
    OrginalCompanyList: any =[];
    constructor(private renderer: Renderer2,private database: ChecklistDatabase, private portfolioCompanyService: PortfolioCompanyService, private toastrService: ToastrService) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<KPIItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        // cdk tree that mat tree is based on has a bug causing children to not be rendered in the UI without first setting the data to null
        database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
        this.renderer.listen('window', 'click',(e:Event)=>{
           if(e.target !== this.searchKpiButton?.nativeElement){
               this.allListHidden=true;
           }
       });
    }

    getLevel = (node: KPIItemFlatNode) => node.level;

    isExpandable = (node: KPIItemFlatNode) => node.expandable;

    getChildren = (node: KPIItemNode): KPIItemNode[] => node.children;

    hasChild = (_: number, _nodeData: KPIItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: KPIItemFlatNode) => _nodeData.name === '';

    transformer = (node: KPIItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.name === node.name
            ? existingNode
            : new KPIItemFlatNode();
        flatNode.name = node.name;
        flatNode.id = node.id;
        flatNode.level = level;
        flatNode.isMapped = node.isMapped;
        flatNode.isHeader = node?.isHeader;
        flatNode.isBoldKPI = node?.isBoldKPI;
        flatNode.parentKPIID = node.parentKPIID;
        flatNode.displayOrder = node.displayOrder;
        flatNode.level = level;
        flatNode.mappingKPIId = node.mappingKPIId;
        flatNode.oldIsMapped = node.oldIsMapped;
        flatNode.oldDisplayOrder = node.oldDisplayOrder;
        flatNode.formula =node.formula;
        flatNode.formulaKPIId = node.formulaKPIId;
        flatNode.kpiInfo = node.kpiInfo;
        if (node.children && node.children.length > 0) {
            flatNode.children = node.children;
        }
        flatNode.expandable = (node.children && node.children.length > 0);
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected */
    descendantsAllSelected(node: KPIItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: KPIItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: KPIItemFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);
    }

    /** Select the category so we can insert the new item. */
    addNewItem(node: KPIItemFlatNode) {
        const parentNode = this.flatNodeMap.get(node);
        this.database.insertItem(parentNode, null);
        this.treeControl.expand(node);
    }

    /** Save the node to database */
    saveNode(node: KPIItemFlatNode, itemValue: any) {
        const nestedNode = this.flatNodeMap.get(node);
        this.database.updateItem(nestedNode, itemValue);
    }

    handleDragStart(event, node) {
        event.dataTransfer.setData('foo', 'bar');
        event.dataTransfer.setDragImage(this.emptyItem.nativeElement, 0, 0);
        this.dragNode = node;
    }

    handleDragOver(event, node) {
        event.preventDefault();
        // Handle node expand
        if (node === this.dragNodeExpandOverNode) {
            if (this.dragNode !== node && !this.treeControl.isExpanded(node)) {
                if ((new Date().getTime() - this.dragNodeExpandOverTime) > this.dragNodeExpandOverWaitTimeMs) {
                    this.treeControl.expand(node);
                }
            }
        } else {
            this.dragNodeExpandOverNode = node;
            this.dragNodeExpandOverTime = new Date().getTime();
        }

        // Handle drag area
        const percentageY = event.offsetY / event.target.clientHeight;
        if (percentageY < 0.25) {
            this.dragNodeExpandOverArea = 'above';
        } else if (percentageY > 0.75) {
            this.dragNodeExpandOverArea = 'below';
        } else {
            this.dragNodeExpandOverArea = 'center';
        }
    }

    handleDrop(event, node) {
        event.preventDefault();
        let newItem: KPIItemNode;
        let dropNode = this.dragNode;
        dropNode.parentKPIID = node.id;
        if (node !== this.dragNode) {
            if (node.level < 2) {
               
                dropNode.isMapped = true;
                if (this.dragNodeExpandOverArea === 'above') {
                    if (node.level == 1 && this.dragNode?.children?.length > 0) {
                        this.toastrService.error("Only one level of hierarchy is allowed", "", { positionClass: "toast-center-center" });
                        event.preventDefault();
                    } else {
                        let isLastdropNode = this.getParent(node);
                        if (this.isDuplicateCheck(this.flatNodeMap.get(isLastdropNode), this.flatNodeMap.get(dropNode))) {
                            this.database.deleteItem(this.flatNodeMap.get(dropNode));
                            newItem = this.database.copyPasteItemAbove(dropNode, this.flatNodeMap.get(node));
                        }else {
                            this.toastrService.error("Multiple Duplicate Child KPIs not allowed under same parent", "", { positionClass: "toast-center-center" });
                            event.preventDefault();
                        }
                    }

                } else if (this.dragNodeExpandOverArea === 'below') {
                    let isLastdropNode = this.getParent(node);
                    if(this.dataSource.data[this.dataSource.data.length - 1].id == node.id || this.dataSource.data[this.dataSource.data.length - 1].id == isLastdropNode?.id){
                        if(isLastdropNode == null){
                            this.database.deleteItem(this.flatNodeMap.get(dropNode));
                            newItem = this.database.copyPasteItemBelow(dropNode, this.flatNodeMap.get(node));
                        }else{
                            this.database.deleteItem(this.flatNodeMap.get(dropNode));
                            newItem = this.database.copyPasteItemBelow(dropNode, this.flatNodeMap.get(isLastdropNode));
                        }
                       
                    }
                    else if (node.level == 1 && this.dragNode?.children?.length > 0) {
                        this.toastrService.error("Only one level of hierarchy is allowed", "", { positionClass: "toast-center-center" });
                        event.preventDefault();
                    } else {
                        if (this.isDuplicateCheck(this.flatNodeMap.get(isLastdropNode), this.flatNodeMap.get(dropNode))) {
                            this.database.deleteItem(this.flatNodeMap.get(dropNode));
                            newItem = this.database.copyPasteItemBelow(dropNode, this.flatNodeMap.get(node));
                        }else {
                            this.toastrService.error("Multiple Duplicate Child KPIs not allowed under same parent", "", { positionClass: "toast-center-center" });
                            event.preventDefault();
                        }
                    }
                } else {
                    if (node.level == 0 && (dropNode.children == undefined || dropNode?.children?.length ==0)) {
                        if (this.isDuplicateCheck(this.flatNodeMap.get(node), this.flatNodeMap.get(dropNode))) {
                            this.database.deleteItem(this.flatNodeMap.get(dropNode));
                            newItem = this.database.copyPasteItem(dropNode, this.flatNodeMap.get(node));
                        }
                        else {
                            this.toastrService.error("Multiple Duplicate Child KPIs not allowed under same parent", "", { positionClass: "toast-center-center" });
                            event.preventDefault();
                        }
                    } else {
                        this.toastrService.error("Only one level of hierarchy is allowed", "", { positionClass: "toast-center-center" });
                        event.preventDefault();
                    }
                }
            }
            else {
                this.toastrService.error("Only one level of hierarchy is allowed", "", { positionClass: "toast-center-center" });
                event.preventDefault();
            }
            if(newItem){
                this.treeControl.expandDescendants(this.nestedNodeMap.get(newItem));
                this.checklistSelection.select(dropNode);
                this.SetKPIChecked(dropNode, true);
            }
        }
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
        this.isDisabledCancelBtn = false;
        this.isDisabledSaveBtn = false;
        this.ValidateAllChecked();
        this.treeControl.expandAll();
    }
    isDuplicateCheck(node: any, dropNode: any) {
        let isExist = node?.children?.find(
            (x) => x.name.toLowerCase() == dropNode.name.toLowerCase()
        );
        if (isExist == undefined) return true;
        else return false;
    }
    handleDragEnd(event) {
        this.dragNode = null;
        this.dragNodeExpandOverNode = null;
        this.dragNodeExpandOverTime = 0;
    }
    ngOnInit() {       
        this.selectedKpiType=(this.kpiTypes || []).length > 0 ? this.kpiTypes[0].items[0]:null;
        this.toastrService.overlayContainer = this.toastContainer;
        this.getCompanyList();
    }

    getCompanyList() {
        this.isLoader = true;
        this.portfolioCompanyService.getPortfolioCompany().subscribe({next:(result) => {
            if (result != null && result.length > 0) {
                this.companyList = result;
                this.selectedCompany[0] = result[0];
                this.portfolioCompanyList = result.filter(item => item !== this.selectedCompany[0]);
                this.OrginalCompanyList = JSON.stringify(result);  
                this.companyId = this.selectedCompany[0].encryptedPortfolioCompanyId;
                this.GetSelectedKpiData(this.selectedKpiType); 
                this.isEnableView = true;
        }
            this.isLoader = false;
        }, error:(error) => {
            this.isLoader = false;
        }});
    }

    onSelectCompany(company: any) {
        this.deletedMappedkpi = [];
        this.selectedCopyToCompanyList = [];
        this.selectedCompany = company.value;
        this.companyId = company.value.encryptedPortfolioCompanyId 
        this.portfolioCompanyList =this.companyList.filter(item => item !== this.selectedCompany); 
        this.getAll();
        this.getKPIUnMappingList();
    }
    getAll() {
        if (
          this.kpiType != undefined &&
          this.companyId != undefined &&
          this.companyId != null &&
          this.kpiType != null
        )
          this.getKPIMapping();
        this.PreviousSelectedTreedata = undefined;
        this.isCheckedAll = true;
        this.isDisabledCancelBtn = true;
        this.isDisabledSaveBtn = true;
        if (this.reload != null) {
          this.getKPIMapping();
          this.PreviousSelectedTreedata = undefined;
          this.isCheckedAll = true;
          this.isDisabledCancelBtn = true;
          this.isDisabledSaveBtn = true;
        }
    }
    async LoadTree() {
        this.database.initialize(this.kpiTreeList);
        this.database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }
    isChecked(event: any) {
        this.CheckAndUnCheckAll();
        this.SetMapAllNodes(event.checked);
        this.isEnableSaveButton();
    }
    IsCheckParent(event, node) {
        if (event.checked) {
            node.isMapped = true;
            this.SetKPIChecked(node, true);
        }
        else {
            node.isMapped = false;
            this.SetKPIChecked(node, false);
        }
        this.isEnableSaveButton();
        this.ValidateAllChecked();
    }
    IsCheckChild(event, node) {
        if (event.checked) {
            node.isMapped = true;
            this.SetKPIChecked(node, true);
        }
        else {
            node.isMapped = false;
            this.SetKPIChecked(node, false);
        }
        this.isEnableSaveButton();
        this.ValidateAllChecked();
    }
    OnYes(event) {
        this.deletedMappedkpi = [];
        this.isCancelPopup = false;
        this.isCheckedAll = false;
        this.getKPIMapping();
        this.getKPIUnMappingList();
    }
    OnNo(event) {
        this.isCancelPopup = false;
    }
    OnCancelSavePopup(event) {
        this.isSavePopup = false;
    }
    SaveMapping() {
        this.GetDataSourceData();
        this.updateMapping(this.dataSource.data);
    }
    mergeDeleteKPI(){
        if(this.deletedMappedkpi.length > 0){
            this.deletedMappedkpi.forEach(element => {
                    this.dataSource.data.push(element);
            });
        }
        this.deletedMappedkpi = [];
    }
    GetDataSourceData() {
        for (let i = 0; i < this.dataSource.data.length; i++) {
            if (this.dataSource.data[i].children != null && this.dataSource.data[i].children != undefined && this.dataSource.data[i].children.length > 0) {
                for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                    if (this.dataSource.data[i].children[j].isMapped)
                        this.dataSource.data[i].isMapped = true;
                    if (!this.dataSource.data[i].children[j].isMapped && this.dataSource.data[i].children[j].mappingKPIId > 0) {
                        this.isUnMapped = true;
                    }
                }
            }
        }
    }
    public filters(array, text) {
        const getChildren = (result, object) => {
            if (object.name.toLowerCase().includes(text.toLowerCase())) {
                result.push(object);
                return result;
            }
            if (Array.isArray(object.children)) {
                const children = object.children.reduce(getChildren, []);
                if (children.length) result.push({ ...object, children });
            }
            return result;
        };
        return array.reduce(getChildren, []);
    }
    public filter(filterText: string): any {
        let filteredTreeData;
        if (filterText) {
            filteredTreeData = this.filters(this.dataSource.data, filterText);
        } else {
            filteredTreeData = this.dataSource.data;
        }
        return filteredTreeData;
    }
    private uniqByKeepFirst(a, key) {
        let seen = new Set();
        return a.filter(item => {
            let k = key(item);
            return seen.has(k) ? false : seen.add(k);
        });
    }
    FilterKPI(filterText: string) {
        
        if (filterText) {
            this.filteredTreeData = this.filterobject(filterText);
            this.SearchSelectedTreeData = [...this.filteredTreeData];
            this.isCheck = "Y";
        }
        else {
            this.filteredTreeData = this.searchDataList;
            this.SearchSelectedTreeData = [];
            this.isCheck = "N";
        }
        if ((this.filteredTreeData.length == 0 || this.filteredTreeData.length > 0) && this.isCheck == "N") {
            this.Emptyischeck = true;       
            this.checkPreviousandCurrentselcted();
            this.LoadTree();
            this.SearchClearSelectionUnselect();
            this.filteredTreeData = this.dataSource.data;
            this.isCheckedAll = false;
        }
        if (this.filteredTreeData.length == 0 && this.isCheck == "Y" && this.SearchSelectedTreeData.length == 0) {
            this.filteredTreeData = this.dataSource.data;
            this.Emptyischeck = false
        }
        if (this.filteredTreeData.length > 0 && this.isCheck == "Y" && this.SearchSelectedTreeData.length > 0) {
            this.Emptyischeck = true;
            this.checkPreviousandCurrentselcted();
            this.exitsSearchClearSelectionUnselect();
        }
        if (this.filteredTreeData.length == 0 && this.isCheck == "Y") {
            this.Emptyischeck = false;
        }
        this.database.initialize(this.filteredTreeData);
        this.database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
        this.SetCheckListSelection();
        this.ValidateAllChecked();
        this.SetCheckListSelection();
    }
    checkPreviousandCurrentselcted() {
        let CurrentThreaddata = this.SearchSelectedTreeData;
        this.PreviousSelectedTreedata = [...CurrentThreaddata];
        let curretPreviousTreedata = [];
        if (this.currentselectedthread.length > 0) {
            for (let k = 0; k < this.currentselectedthread.length; k++) {
                if (this.currentselectedthread[k] != undefined)
                    curretPreviousTreedata.push(this.currentselectedthread[k]);
            }
        }
        this.SearchSelectedTreeData = [];
        if (curretPreviousTreedata != null && curretPreviousTreedata != undefined && curretPreviousTreedata.length > 0) {
            this.SearchSelectedTreeData = [...this.currentselectedthread];
        }
        else {
            this.SearchSelectedTreeData = this.PreviousSelectedTreedata;
        }
    }
    toObject(arr) {
        let rv = {};
        for (let i = 0; i < arr.length; ++i)
            if (arr[i] !== undefined) rv[i] = arr[i];
        return rv;
    }
    filterobject(filterText) {
        let matchingArray = [];
        this.dataSource.data.forEach(key => {
            const parent = (key.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
            let Con = key.children?.filter(b => b.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
            if (key.children?.length > 0 && Con.length > 0) {
                const ch = key.children?.filter(b => b.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
                matchingArray.push({ ...key, children: ch })
            }
            if (parent && ( Con?.length == 0 || Con == undefined)) {
                const child = key.children;
                matchingArray.push({ ...key, children: child });
            }
        });
        return matchingArray;
    }
    SearchClearSelectionUnselect() {
        let AlreadySelected: any = [];
        let ChildAlreadySelected: any = [];
        let parentunchecked: boolean = true;
        for (let i = 0; i < this.dataSource.data.length; i++) {
            AlreadySelected = this.SearchSelectedTreeData.filter(F => +F.id === +this.dataSource.data[i].id);
            for (let C = 0; C < AlreadySelected.length; C++) {
                this.dataSource.data[i].isMapped = AlreadySelected[C].isMapped;
                parentunchecked = AlreadySelected[C].isMapped;
                if (AlreadySelected[C].children.length > 0)
                    this.dataSource.data[i].children = AlreadySelected[C].children;
                if (this.dataSource.data[i].children.length == 0) {
                    if (AlreadySelected[C].children.length > 0) {
                        this.dataSource.data[i].children = AlreadySelected[C].children;
                        AlreadySelected[C].children.forEach(element => {
                            this.dataSource.data = this.dataSource.data.filter((X: any) => X.id != element.id);
                            this.dataSource.data.filter(function (ele) { return ele.id != element.id })
                        });
                    }
                }
                if (!parentunchecked) {
                    if (this.dataSource.data[i].children != null && this.dataSource.data[i].children != undefined && this.dataSource.data[i].children.length > 0) {
                        for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                            for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                                this.dataSource.data[i].children[j].isMapped = parentunchecked;
                            }
                        }
                    }
                }
                //}
            }
        }
    }
    exitsSearchClearSelectionUnselect() {
        let AlreadySelected: any = [];
        let parentunchecked: boolean = true;
        for (let i = 0; i < this.filteredTreeData.length; i++) {
            AlreadySelected = this.SearchSelectedTreeData.filter(F => +F.id === +this.filteredTreeData[i].id);
            for (let C = 0; C < AlreadySelected.length; C++) {
                this.filteredTreeData[i].isMapped = AlreadySelected[C].isMapped;
                parentunchecked = AlreadySelected[C].isMapped;
                    if (AlreadySelected[C]?.children?.length > 0)
                    {
                        this.filteredTreeData[i].children = AlreadySelected[C].children;
                    }
                    if (this.filteredTreeData[i]?.children?.length == 0) {
                        if (AlreadySelected[C].children.length > 0) {
                            this.filteredTreeData[i].children = AlreadySelected[C].children;
                            AlreadySelected[C].children.forEach(element => {
                                this.filteredTreeData = this.filteredTreeData.filter((X: any) => X.id != element.id);
                                this.filteredTreeData.filter(function (ele) { return ele.id != element.id })
                            });
                        }
                    }
                    if (!parentunchecked) {
                        if (this.filteredTreeData[i]?.children != null && this.filteredTreeData[i].children != undefined && this.filteredTreeData[i].children.length > 0) {
                            for (let j = 0; j < this.filteredTreeData[i].children.length; j++) {
                                for (let j = 0; j < this.filteredTreeData[i].children.length; j++) {
                                    this.filteredTreeData[i].children[j].isMapped = parentunchecked;
                                }
                            }
                        }
                    }
                //}
            }
        }

    }
    findDuplicate(kpiList:any[]) {
        let mappedList = (this.kpiList || [])?.filter((x) => x.isMapped);
        let kpiNameList = mappedList?.map(function (item) {
          return item.name;
        });
        return kpiNameList.some(function (item, idx) {
          return kpiNameList.indexOf(item) != idx;
        });
    }
    updateMapping(kpiList) {
        if (this.findDuplicate(kpiList)){
            this.isSavePopup = false;
            this.toastrService.error(
                "Duplicate parent KPI mapped with same company",
                "",
                { positionClass: "toast-center-center" }
              );
        }
        else {
          this.mergeDeleteKPI();
          this.isLoader = true;
          const companyIds = [];
          this.selectedCopyToCompanyList.forEach((company) => companyIds.push(company.portfolioCompanyID.toString()));
          let kPIMappingQueryModel = {
            KPIMappings: kpiList,
            CompanyIds: companyIds?.toString()
          };
       
            this.portfolioCompanyService
                .updateKPIMappingList(
                kPIMappingQueryModel,
                this.companyId,
                this.kpiType,
                this.moduleID
                )
                .subscribe({
                next:(result) => {
                    let resp = result;
                    if (resp != null && resp.code == "OK") {
                    this.isSavePopup = false;
                    this.deletedMappedkpi = [];
                    this.PreviousSelectedTreedata = [];
                    this.SearchSelectedTreeData = [];
                    this.kpiList = [];
                    this.listKPIList = [];
                    this.toastrService.success(
                        "Selected KPI(s) are mapped successfully with the company",
                        "",
                        { positionClass: "toast-center-center" }
                    );
                    this.selectedCopyToCompanyList =[];
                    this.OnCopyCompanyEmit.emit();
                    this.getKPIUnMappingList();
                    this.getAll();
                    } else {
                    this.toastrService.error("Error occured", "", {
                        positionClass: "toast-center-center",
                    });
                    this.isSavePopup = false;
                    }
                    this.isMappingContinue = false;
                    this.isUnMapped = false;
                    this.isLoader = false;
                },
               error: (error) => {
                    this.isLoader = false;
                }
        });
          
        }
    }

    getKPIUnMappingList() {
        this.isLoader = true;
        this.portfolioCompanyService.getKPIUnMappingList(this.companyId, this.kpiType, this.moduleID).subscribe({
            next: (result) => {
                this.listKPIList = result;
                this.filteredAllKpiList = result;
                this.isLoader = false;
            },
            error: (_error) => {
                this.isLoader = false;
            }
        });
    }
    getKPIMapping() {
        this.currentselectedthread = [];
        this.isLoader = true;      
        this.portfolioCompanyService.getKPIMappingList(this.companyId, this.kpiType, this.moduleID).subscribe((result) => {
            let resp = result;
            if (resp != null && resp.code == "OK") {
                this.Emptyischeck = true;
                this.kpiList = resp.body;
                this.kpiTreeList = this.kpiList;
                this.filteredTreeData = this.kpiTreeList;
                this.LoadTree();
                this.kpiName = "";
                this.PreviousSelectedTreedata = undefined;
                this.SetCheckListSelection();
                this.ValidateAllChecked();
                this.treeControl.expandAll();
                this.OriginalKpiList = JSON.parse(JSON.stringify(this.dataSource.data));
                this.SetDisableCopyTo(resp);
            }
            this.isLoader = false;
            this.disableButtons();
            this.ValidateAllChecked();
            this.treeControl.expandAll();
        });
   
    }

    private SetDisableCopyTo(resp: any) {
        if (resp?.body?.length == 0) {
            this.disableCopyTo = true;
            this.isDisabledSaveBtn = true;
            this.isDisabledCancelBtn = true;
        } else {
            this.disableCopyTo = false;
            this.isDisabledSaveBtn = false;
            this.isDisabledCancelBtn = false;
        }
    }

    SetKPIChecked(checkednode: any, checked: boolean) {
        let index = this.dataSource.data.findIndex(x => x.id == checkednode.id);

        if (index > -1) {
            this.dataSource.data[index].isMapped = checked;
            if (this.dataSource.data[index].children != null && this.dataSource.data[index].children != undefined && this.dataSource.data[index].children.length > 0) {
                for (let i = 0; i < this.dataSource.data[index].children.length; i++) {
                    this.dataSource.data[index].children[i].isMapped = checked;
                }
            }
        }
        else {
            for (let i = 0; i < this.dataSource.data.length; i++) {
                if (this.dataSource.data[i].children != null && this.dataSource.data[i].children != undefined && this.dataSource.data[i].children.length > 0) {
                    for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                        if (this.dataSource.data[i].children[j].id === checkednode.id) {
                            this.dataSource.data[i].children[j].isMapped = checked;
                        }
                    }
                }
            }
        }
        let arrayobj: any;
        let finddata: any = this.dataSource.data[index]
        if (finddata != undefined) {
            this.clonekpiTreeList = this.dataSource.data.filter(x => x.id == finddata.id);
            this.clonekpiTreeList.forEach(element => {
                let obj = <KPIItemNode>{}
                obj.children = element.children;
                obj.id = element.id;
                obj.displayOrder = element.displayOrder;
                obj.isMapped = element.isMapped;
                obj.isBoldKPI = element?.isBoldKPI;
                obj.isHeader = element?.isHeader;
                obj.mappingKPIId = element.mappingKPIId;
                obj.name = element.name;
                obj.oldDisplayOrder = element.oldDisplayOrder;
                obj.oldIsMapped = element.oldIsMapped;
                obj.parentKPIID = element.parentKPIID;
                obj.formula =element.formula;
                obj.formulaKPIId =element.formulaKPIId;
                obj.kpiInfo = element.kpiInfo;
                this.currentselectedthread.push(obj);
            });
        }
        if (finddata == undefined) {
            let query = this.dataSource.data.filter(
                x => x.children?.some(y => y.id == checkednode.id));
            query.forEach(element => {
                let obj = <KPIItemNode>{}
                obj.children = element.children;
                obj.id = element.id;
                obj.displayOrder = element.displayOrder;
                obj.isMapped = element.isMapped;
                obj.isHeader = element.isHeader;
                obj.isBoldKPI = element.isBoldKPI;
                obj.mappingKPIId = element.mappingKPIId;
                obj.name = element.name;
                obj.oldDisplayOrder = element.oldDisplayOrder;
                obj.oldIsMapped = element.oldIsMapped;
                obj.parentKPIID = element.parentKPIID;
                obj.formula = element.formula;
                obj.formulaKPIId = element.formulaKPIId;
                obj.kpiInfo = element.kpiInfo;
                this.currentselectedthread.push(obj);
            });
        }
    }
    SetCheckListSelection() {
        for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
            if (this.treeControl.dataNodes[i].isMapped) {
                this.checklistSelection.select(this.treeControl.dataNodes[i]);
                this.treeControl.expand(this.treeControl.dataNodes[i]);
            }
        }
    }
    CheckAndUnCheckAll() {
        this.treeControl.dataNodes.forEach((r, index) => {
            this.treeControl.expand(this.treeControl.dataNodes[index]);
            this.isCheckedAll
                ? this.checklistSelection.select(this.treeControl.dataNodes[index])
                : this.checklistSelection.deselect(this.treeControl.dataNodes[index]);
        });
    }
    disableButtons() {
        this.isDisabledCancelBtn = true;
        this.isDisabledSaveBtn = true;
    }
    OnCancelMapAlertPopup() {
        this.isUnMapped = false;
        this.isMapAlertPopup = false;
    }
    IsSaveMapping(event) {
        this.isMapAlertPopup = false;
        this.updateMapping(this.dataSource.data);
    }
    isEnableSaveButton() {
        this.isDisabledCancelBtn = true;
        this.isDisabledSaveBtn = true;
        for (let i = 0; i < this.dataSource.data.length; i++) {
            if (this.dataSource.data[i].isMapped !== this.dataSource.data[i].oldIsMapped) {
                this.isDisabledCancelBtn = false;
                this.isDisabledSaveBtn = false;
            }
            if (this.dataSource.data[i].children != null && this.dataSource.data[i].children != undefined && this.dataSource.data[i].children.length > 0) {
                for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                    if (this.dataSource.data[i].children[j].isMapped !== this.dataSource.data[i].children[j].oldIsMapped) {
                        this.isDisabledCancelBtn = false;
                        this.isDisabledSaveBtn = false;
                    }
                }
            }
        }
    }
    SetMapAllNodes(isChecked: boolean) {
        this.searchDataList = [];
        for (let i = 0; i < this.dataSource.data.length; i++) {
            this.dataSource.data[i].isMapped = isChecked;
            if (this.dataSource.data[i].children != null && this.dataSource.data[i].children != undefined && this.dataSource.data[i].children.length > 0) {
                for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                    this.dataSource.data[i].children[j].isMapped = isChecked;
                }
            }
        }

        this.currentselectedthread = [...this.dataSource.data];

        if (isChecked) {

            this.isDisabledCancelBtn = false;
            this.isDisabledSaveBtn = false;
        }
        else {
            this.currentselectedthread = [];
            this.isDisabledCancelBtn = true;
            this.isDisabledSaveBtn = true;
        }
        this.searchDataList = this.database.data;
    }
    ValidateAllChecked() {
        this.isCheckedAll = true;
        for (let i = 0; i < this.dataSource.data.length; i++) {
            if (!this.dataSource.data[i].isMapped) {
                this.isCheckedAll = false;
                break;
            }
            if (this.dataSource.data[i].children != null && this.dataSource.data[i].children != undefined && this.dataSource.data[i].children.length > 0) {
                for (let j = 0; j < this.dataSource.data[i].children.length; j++) {
                    if (!this.dataSource.data[i].children[j].isMapped) {
                        this.isCheckedAll = false;
                        break;
                    }
                }
            }
        }

    }
    ngAfterViewInit() {
        this.treeHeight = (window.innerHeight - 300) + "px";
        this.kpilistheight =  (window.innerHeight - 300) + + "px";
    }
    onResized(event: any) {
        this.treeHeight = (window.innerHeight - 300) + "px";
        this.kpilistheight =  (window.innerHeight - 300) + "px";
    }
    createDuplicate(node:any)
    {
        this.isLoader = true;
       
            let kpiModel = {
                KPIType: this.kpiType == "Profit & Loss KPI" ? 'Profit And Loss KPI' : this.kpiType,
                id: node.id,
                moduleId:this.moduleID
            };
            this.portfolioCompanyService.createDuplicateKPI(kpiModel).subscribe({
                next:(result) => {
                    this.isLoader = false;
                    let kpiId = result;
                    if (kpiId != null && kpiId > 0) {
                        this.toastrService.success("Duplicate KPI created successfully", "", { positionClass: "toast-center-center" });
                        this.createDuplicateKPIPosition(node, kpiId);
                        this.getMapButtonStatus();
                    }
                    else
                        this.toastrService.error("Error occurred to create duplicate kpi", "", { positionClass: "toast-center-center" });
                },
                error:_error => {
                    this.toastrService.error("Error occurred to create duplicate kpi", "", { positionClass: "toast-center-center" });
                    this.isLoader = false;
                }
    });
        
    }
    createDuplicateKPIPosition(node: any, kpiId: number) {
        let duplicateNode = JSON.parse(JSON.stringify(node));
        duplicateNode.id = kpiId;
        duplicateNode.displayOrder = null;
        duplicateNode.expandable = false;
        duplicateNode.isMapped = true;
        duplicateNode.mappingKPIId = 0;
        duplicateNode.oldIsMapped = false;
        duplicateNode.oldDisplayOrder = null;
        duplicateNode.parentKPIID = 0;
        duplicateNode.level = 0;
        duplicateNode.formula = null;
        duplicateNode.formulaKPIId = null;
        duplicateNode.children = [];
        this.database.insertItemAbove(node, duplicateNode);
        this.database.deleteItem(duplicateNode);
        let from = this.flatNodeMap.get(node);
        let dropItemNode: KPIItemNode = duplicateNode;
        if (node.level == 0)
            this.database.copyPasteItemBelow(dropItemNode, from);
        else if (node.level == 1) {
            let dropNode = this.getParent(node);
            this.database.copyPasteItemBelow(duplicateNode, this.flatNodeMap.get(dropNode));
        }
        else {
            let dropNodes = this.getAncestors(this.treeControl.dataNodes, node.id);
            if (dropNodes?.length > 0)
                this.database.copyPasteItemBelow(duplicateNode, this.flatNodeMap.get(dropNodes[0]));
        }
        this.treeControl.expandAll();
    }
    getParent(node: any) {
        const { treeControl } = this;
        const currentLevel = treeControl.getLevel(node);
        if (currentLevel < 1) {
            return null;
        }
        const startIndex = treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = treeControl.dataNodes[i];

            if (treeControl.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
    }
    getAncestors(array, id) {
        if (typeof array !== 'undefined') {
            for (let i = 0; i < array.length; i++) {
                if (array[i].id === id) {
                    return [array[i]];
                }
                const a = this.getAncestors(array[i].children, id);
                if (a !== null) {
                    a.unshift(array[i]);
                    return a;
                }
            }
        }
        return null;
    }
    openFormulaPopup(node: any) {
        let kpiModel = {
            kpi: node.name,
            kpiId: node.id,
            mappingKpiId: node.mappingKPIId,
            formula: node.formula,
            formulaKPIId: node.formulaKPIId,
        };
        this.selectedFormulaKPI = kpiModel;
        this.isOpenPopUp = true;
    }
    closeFormulaPopUp(data: any) {
        this.isOpenPopUp = false;
        if (data != null && data != undefined) {
            if(data.MappingId > 0){
               this.getKPIMapping();
            }else{
               this.listKPIList.forEach(element => {
                if (data?.KpiId == element?.id) {
                    element.formula = data?.Formula;
                }
                else {
                    if (element?.children?.length > 0) {
                        element?.children?.forEach(element => {
                            if (data?.KpiId == element?.id) {
                                element.formula = data?.Formula;
                            }
                        });
                    }
                }
               });
            }
            this.kpiTreeList = this.kpiList;
            this.filteredTreeData = this.kpiTreeList;
            this.LoadTree();
            this.kpiName = "";
            this.PreviousSelectedTreedata = undefined;
            this.SetCheckListSelection();
            this.ValidateAllChecked();
            this.treeControl.expandAll();
            this.OriginalKpiList = JSON.parse(JSON.stringify(this.dataSource.data));
        }
    }
    GetSelectedKpiData(kpiType) {
        this.deletedMappedkpi=[];
        this.kpiType =kpiType.name;
        this.selectedKpiType = kpiType;
        this.moduleID =kpiType?.moduleID;
        this.getAll();
        this.getKPIUnMappingList();
    }
    getSelectAllListofkpi(){
        this.isLoader = true;
        this.kpilistheight = 0 + "px";
        this.isDisabledSaveBtn = false;
        this.isDisabledCancelBtn = false;
        setTimeout(() => {
        this.listKPIList.forEach(element => {
            element.isMapped = true;
            this.kpiList.push(element);
        });
        this.kpiTreeList = this.kpiList;
        this.filteredTreeData = this.kpiTreeList;
        this.listKPIList = [];
        this.filteredAllKpiList = [];
        this.LoadTree();
        this.kpiName = "";
        this.PreviousSelectedTreedata = undefined;
        this.SetCheckListSelection();
        this.ValidateAllChecked();
        this.treeControl.expandAll();
        this.isLoader = false;
        }, 100);
    }

    async addToMappedKPI(data:any,index:any,action:any){
        this.isLoader = true;
        this.kpilistheight = (window.innerHeight - 300) + "px";
        this.kpiAllListItem = "";
        this.kpiName = "";
        let dataStringify = JSON.parse(JSON.stringify(data));
       if(action == 'Add'){
        data.isMapped = true;
        let currentIndex = this.listKPIList.findIndex(std=> std.id === data.id);
        this.listKPIList.splice(currentIndex,1);
        this.filteredAllKpiList = this.listKPIList;
        this.database.insertNewItem(data); 
        this.kpiList = this.dataSource.data;
        this.kpiTreeList = this.kpiList;
       }else{
        if(data?.children && data?.children?.length>0){
            data?.children.forEach(element => {
                element.children = null;
                element.mappingKPIId = 0;
                this.database.insertItemBelow(this.flatNodeMap.get(data),element);  
            });
        }
        this.database.deleteItem(this.flatNodeMap.get(data));
        if(data?.mappingKPIId > 0 && data?.mappingKPIId != null){
            data.isMapped = false;
            data.children = null;
            if(this.deletedMappedkpi.length > 0){
                let checkDuplicateKPI = this.deletedMappedkpi.filter(kpi => kpi.id == data.id);
                if(checkDuplicateKPI.length == 0) {
                    this.deletedMappedkpi[this.deletedMappedkpi.length] = data;
                }
            }else{
                this.deletedMappedkpi[this.deletedMappedkpi.length] = data;
            }
            
        }
        this.kpiList = this.dataSource.data;
        this.kpiTreeList = this.kpiList;
        dataStringify.isMapped = false;
        if(dataStringify?.children && dataStringify?.children?.length>0){
            dataStringify?.children.forEach(element => {
                element.isMapped = false;
                element.children = null;
                if(this.deletedMappedkpi.length > 0){
                    let checkdeletekpi = this.deletedMappedkpi.filter(kpi => kpi.id == element.id && kpi.mappingKPIId == element.mappingKPIId);
                    if(checkdeletekpi.length == 0) {
                        this.deletedMappedkpi[this.deletedMappedkpi.length] = element;
                    }
                }else{
                    this.deletedMappedkpi[this.deletedMappedkpi.length] = element;
                }  
            });
        }
        dataStringify.children = null;
        dataStringify.mappingKPIId = 0;
        this.listKPIList.push(JSON.parse(JSON.stringify(dataStringify)));
        this.filteredAllKpiList = this.listKPIList;
       
        this.kpiList = this.dataSource.data;
        this.kpiTreeList = this.kpiList;
        if(this.kpiList?.length == 0){
            this.kpilistheight = 0 + "px";
        }
       }
        setTimeout(() => {
            this.isLoader = false;
            this.getMapButtonStatus();
        }, 200);
    }
    deleteNodeFromkpiList(nodes: any, nodeToDelete: any) {
        let val = nodeToDelete.id;
        let index = nodes.findIndex(function(item, i){
          return item.id === val
        });
        if (index > -1) {
            nodes.splice(index, 1);
        } else {
            nodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                    this.deleteNodeFromkpiList(node.children, nodeToDelete);
                }
            });
        }
    }
    onSelectAllListkpi(){
        if(this.allListHidden){
            this.allListHidden = false;
        }else{
            this.allListHidden = true;
        }
    }
    toggleListDisplay(sender: number) {
        if (sender === 1) {
          this.allListHidden = false;
        } else {
          setTimeout(() => {
            this.allListHidden = true;
            if (!this.listKPIList.includes(this.kpiAllListItem)) {
              this.filteredAllKpiList = this.listKPIList;
            }
          }, 500);
        }
      }
      onKeyPress(event) {
        if (!this.allListHidden) {
          if (event.key === 'Escape') {
            this.toggleListDisplay(1);
          }
          if (event.key === 'Enter') {
    
            this.toggleListDisplay(1);
          }
        } 
      }
      getCopytoAllCompanies(){
        // copy to all function will do
      }
      getFilteredAllKpiList() {  
 
        this.allListHidden = false;
        if (!this.allListHidden && this.kpiAllListItem !== undefined) { 
            this.filteredAllKpiList = this.listKPIList.filter((item) => item.name.toLowerCase().includes(this.kpiAllListItem.toLowerCase()));
        }
        return this.filteredAllKpiList;
      }
      onCopytoCompanyFunction(event:any){
        this.getMapButtonStatus();
      }
      getMapButtonStatus(){
        let dataSourseData =  JSON.parse(JSON.stringify(this.dataSource.data));
        let areEqual = this.compareArrays(dataSourseData, this.OriginalKpiList);
        if(this.selectedCopyToCompanyList.length >0 || !areEqual){
            this.isDisabledSaveBtn = false;
            this.isDisabledCancelBtn = false;
        }else{
            this.isDisabledSaveBtn = true;
            this.isDisabledCancelBtn = true;
        }
      }
      compareArrays(array1, array2) {
        if (array1.length !== array2.length) {
          return false;
        }
        for (let i = 0; i < array1.length; i++) {
          if (JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) {
            return false;
          }
        }
        return true;
      }
    
}
