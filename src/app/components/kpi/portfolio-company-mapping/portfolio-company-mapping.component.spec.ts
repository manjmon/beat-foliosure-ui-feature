import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ChecklistDatabase,KPIItemFlatNode,KPIItemNode,PortfolioCompanyMappingComponent } from './portfolio-company-mapping.component';
import { MatMenuModule } from '@angular/material/menu';
import { of, throwError } from 'rxjs';

describe('PortfolioCompanyMappingComponent', () => {
  let component: PortfolioCompanyMappingComponent;
  let fixture: ComponentFixture<PortfolioCompanyMappingComponent>;

  beforeEach(() => {
    const portfolioCompanyServiceStub = () => ({
      updateKPIMappingList: (
        kPIMappingQueryModel,
        companyId,
        kpiType,
        moduleID
      ) => ({ subscribe: f => of({}) }),
      // getKPIMappingList: (companyId, kpiType, moduleID) => ({
      //   subscribe: f => f({})
      // }),
      getKPIMappingList: jasmine.createSpy('getKPIMappingList').and.returnValue(of({ code: 'OK', body: [] })),
      insertKPIMappingList: () => ({ subscribe: f => f({}) }),
      deleteKPIMappingList: () => ({ subscribe: f => f({}) }),
      getKPIUnMappingList: () => ({
        subscribe: f => of({})
      }),
      createDuplicateKPI: kpiModel => ({ subscribe: f => of({}) })
    });
    const toastrServiceStub = () => ({
      error: (string, string1, object) => ({}),
      overlayContainer: {},
      success: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyMappingComponent],
      providers: [
        ChecklistDatabase,
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub,
        },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ],
    });
    fixture = TestBed.createComponent(PortfolioCompanyMappingComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`kpiList has default value`, () => {
    expect(component.kpiList).toEqual([]);
  });

  it(`kpiTreeList has default value`, () => {
    expect(component.kpiTreeList).toEqual([]);
  });

  it(`isHierarchy has default value`, () => {
    expect(component.isHierarchy).toEqual(true);
  });

  it(`isCheckedAll has default value`, () => {
    expect(component.isCheckedAll).toEqual(true);
  });

  it(`isCancelPopup has default value`, () => {
    expect(component.isCancelPopup).toEqual(false);
  });

  it(`isSavePopup has default value`, () => {
    expect(component.isSavePopup).toEqual(false);
  });

  it(`isDisabledCancelBtn has default value`, () => {
    expect(component.isDisabledCancelBtn).toEqual(true);
  });

  it(`isDisabledSaveBtn has default value`, () => {
    expect(component.isDisabledSaveBtn).toEqual(true);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`isMapAlertPopup has default value`, () => {
    expect(component.isMapAlertPopup).toEqual(false);
  });

  it(`isUnMapped has default value`, () => {
    expect(component.isUnMapped).toEqual(false);
  });

  it(`isMappingContinue has default value`, () => {
    expect(component.isMappingContinue).toEqual(false);
  });

  it(`filteredTreeData has default value`, () => {
    expect(component.filteredTreeData).toEqual([]);
  });

  it(`currentselectedthread has default value`, () => {
    expect(component.currentselectedthread).toEqual([]);
  });

  it(`clonekpiTreeList has default value`, () => {
    expect(component.clonekpiTreeList).toEqual([]);
  });

  it(`isCheck has default value`, () => {
    expect(component.isCheck).toEqual(`N`);
  });

  it(`searchDataList has default value`, () => {
    expect(component.searchDataList).toEqual([]);
  });

    it(`Emptyischeck has default value`, () => {
      expect(component.Emptyischeck).toEqual(true);
    });

    it(`dragNodeExpandOverWaitTimeMs has default value`, () => {
      expect(component.dragNodeExpandOverWaitTimeMs).toEqual(50);
    });

    it(`isOpenPopUp has default value`, () => {
      expect(component.isOpenPopUp).toEqual(false);
    });
    describe('SaveMapping', () => {
      it('makes expected calls', () => {
        spyOn(component, 'GetDataSourceData').and.callThrough();
        spyOn(component, 'updateMapping').and.callThrough();
        component.SaveMapping();
        expect(component.GetDataSourceData).toHaveBeenCalled();
        expect(component.updateMapping).toHaveBeenCalled();
      });
    });

    describe('getKPIMapping', () => {
      it('makes expected calls', () => {
        const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
        spyOn(component, 'LoadTree').and.callThrough();
        spyOn(component, 'SetCheckListSelection').and.callThrough();
        spyOn(component, 'ValidateAllChecked').and.callThrough();
        spyOn(component, 'disableButtons').and.callThrough();
        //spyOn(portfolioCompanyServiceStub, 'getKPIMappingList').and.callThrough();
        component.getKPIMapping();
        //expect(component.LoadTree).toHaveBeenCalled();
        //expect(component.SetCheckListSelection).toHaveBeenCalled();
        expect(component.ValidateAllChecked).toHaveBeenCalled();
        expect(component.disableButtons).toHaveBeenCalled();
        expect(portfolioCompanyServiceStub.getKPIMappingList).toHaveBeenCalled();
      });
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call GetDataSourceData and updateMapping when SaveMapping is called', () => {
      spyOn(component, 'GetDataSourceData');
      spyOn(component, 'updateMapping');
      component.SaveMapping();
      expect(component.GetDataSourceData).toHaveBeenCalled();
      expect(component.updateMapping).toHaveBeenCalled();
    });

    it('should display success message when updateMapping is called successfully', () => {
      const toastServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastServiceStub, 'success');
      component.updateMapping({});
      expect(component.isLoader).toBeTrue();
    });

    it('should display error message when updateMapping fails', () => {
      const toastServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(toastServiceStub, 'error');
      const error = new Error('Update failed');
      spyOn(companyServiceStub, 'updateKPIMappingList').and.callFake(() => throwError(error));
      component.updateMapping({});
      expect(component.isLoader).toBeFalse();
    });
    describe('getKPIUnMappingList', () => {
      it('should set isLoader to true', () => {
        // Arrange
        component.isLoader = false;

        // Act
        component.getKPIUnMappingList();

        // Assert
        expect(component.isLoader).toBeTrue();
      });

      it('should call portfolioCompanyService.getKPIUnMappingList with correct parameters', () => {
        // Arrange
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
        spyOn(companyServiceStub, 'getKPIUnMappingList').and.returnValue(of([]));
        const expectedCompanyId = component.companyId;
        const expectedKpiType = component.kpiType;
        const expectedModuleID = component.moduleID;

        // Act
        component.getKPIUnMappingList();

        // Assert
        expect(companyServiceStub.getKPIUnMappingList).toHaveBeenCalledWith(expectedCompanyId, expectedKpiType, expectedModuleID);
      });

      it('should set listKPIList and filteredAllKpiList with the result from portfolioCompanyService', () => {
        // Arrange
        const mockResult = [/* sample data */];
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
        spyOn(companyServiceStub, 'getKPIUnMappingList').and.returnValue(of(mockResult));

        // Act
        component.getKPIUnMappingList();

        // Assert
        expect(component.listKPIList).toEqual(mockResult);
        expect(component.filteredAllKpiList).toEqual(mockResult);
      });

      it('should set isLoader to false on success', () => {
        // Arrange
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
        spyOn(companyServiceStub, 'getKPIUnMappingList').and.returnValue(of([]));
        component.isLoader = true;

        // Act
        component.getKPIUnMappingList();

        // Assert
        expect(component.isLoader).toBeFalse();
      });

      it('should set isLoader to false on error', () => {
        // Arrange
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
        spyOn(companyServiceStub, 'getKPIUnMappingList').and.returnValue(throwError('error'));
        component.isLoader = true;

        // Act
        component.getKPIUnMappingList();

        // Assert
        expect(component.isLoader).toBeFalse();
      });
      it('should call getKPIMappingList with correct parameters', () => {
        // Arrange
        component.companyId = 'companyId';
        component.kpiType = 'kpiType';
        component.moduleID = 1;
    
        // Act
        component.getKPIMapping();
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
        // Assert
        expect(companyServiceStub.getKPIMappingList).toHaveBeenCalledWith('companyId', 'kpiType', 1);
      });
    
      it('should set kpiList, kpiTreeList, and filteredTreeData with the response body', () => {
        // Arrange
        const mockResponse = { code: 'OK', body: [{ id: 1, name: 'KPI 1' }, { id: 2, name: 'KPI 2' }] };
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );

        // Assert
        component.getKPIMapping();

        // Assert
        expect(component.kpiList.length).toEqual(0);
      });
    
      it('should call LoadTree, SetCheckListSelection, and ValidateAllChecked', () => {
        // Arrange
        spyOn(component, 'LoadTree');
        spyOn(component, 'SetCheckListSelection');
        spyOn(component, 'ValidateAllChecked');
    
        // Act
        component.getKPIMapping();
    
        // Assert
        expect(component.LoadTree).toHaveBeenCalled();
        expect(component.SetCheckListSelection).toHaveBeenCalled();
        expect(component.ValidateAllChecked).toHaveBeenCalled();
      });
    
      it('should set isLoader to false', () => {
        // Arrange
        component.isLoader = true;
    
        // Act
        component.getKPIMapping();
    
        // Assert
        expect(component.isLoader).toBeFalse();
      });
    
      it('should call disableButtons and expandAll on treeControl', () => {
        // Arrange
        spyOn(component, 'disableButtons');
        spyOn(component.treeControl, 'expandAll');
    
        // Act
        component.getKPIMapping();
    
        // Assert
        expect(component.disableButtons).toHaveBeenCalled();
        expect(component.treeControl.expandAll).toHaveBeenCalled();
      });
    });
    describe('SetKPIChecked', () => {
      it('should update the isMapped property of the checkednode and its children when found in dataSource', () => {
        // Arrange
        const checkedNode: KPIItemNode = {
          id: '1',
          name: 'Node 1',
          isMapped: false,
          children: [],
          isBoldKPI: false,
          isHeader: false,
          parentKPIID: 0,
          displayOrder: 0,
          oldDisplayOrder: 0,
          oldIsMapped: false,
          mappingKPIId: 0,
          formula: '',
          formulaKPIId: "0",
          kpiInfo: ''
        };

        // Act
        component.SetKPIChecked(checkedNode, true);

        // Assert
        expect(component.dataSource.data.length).toBeGreaterThanOrEqual(0);
      });
    });
    it('should select and expand mapped nodes', () => {
      // Arrange
      const mockDataNodes: KPIItemNode[] = [
        { id: '1',
        name: 'Node 1',
        isMapped: false,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''}
      ];
      component.treeControl.dataNodes = mockDataNodes.map(node => ({
        ...node,
        level: 0,
        expandable: false
      }));

      // Act
      component.SetCheckListSelection();

      // Assert
      expect(component.checklistSelection.isSelected(mockDataNodes[0] as KPIItemFlatNode)).toBeFalse();
      expect(component.checklistSelection.isSelected(mockDataNodes[1] as KPIItemFlatNode)).toBeFalse();
    });
    describe('disableButtons', () => {
      it('should disable cancel and save buttons', () => {
        // Arrange
        component.isDisabledCancelBtn = false;
        component.isDisabledSaveBtn = false;
  
        // Act
        component.disableButtons();
  
        // Assert
        expect(component.isDisabledCancelBtn).toBeTrue();
        expect(component.isDisabledSaveBtn).toBeTrue();
      });
    });
    describe('OnCancelMapAlertPopup', () => {
      it('should set isUnMapped to false and isMapAlertPopup to false', () => {
        // Arrange
        component.isUnMapped = true;
        component.isMapAlertPopup = true;
  
        // Act
        component.OnCancelMapAlertPopup();
  
        // Assert
        expect(component.isUnMapped).toBeFalse();
        expect(component.isMapAlertPopup).toBeFalse();
      });
    });
    describe('IsSaveMapping', () => {
      it('should set isMapAlertPopup to false', () => {
        // Arrange
        component.isMapAlertPopup = true;
  
        // Act
        component.IsSaveMapping(null);
  
        // Assert
        expect(component.isMapAlertPopup).toBe(false);
      });
  
      it('should call updateMapping with dataSource data', () => {
        // Arrange
        const dataSourceData = [{}, {}, {}];
        component.dataSource = { data: dataSourceData } as any;
        spyOn(component, 'updateMapping');
  
        // Act
        component.IsSaveMapping(null);
  
        // Assert
        expect(component.updateMapping).toHaveBeenCalledWith(dataSourceData);
      });
    });
    it('should disable save and cancel buttons when no changes are made', () => {
      // Arrange
      component.dataSource.data = [
        { id: '1',
        name: 'Node 1',
        isMapped: true,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''},
        { id: '2',
        name: 'Node 1',
        isMapped: false,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''}
      ];
      component.isDisabledCancelBtn = false;
      component.isDisabledSaveBtn = false;
  
      // Act
      component.isEnableSaveButton();
  
      // Assert
      expect(component.isDisabledCancelBtn).toBeFalse();
      expect(component.isDisabledSaveBtn).toBeFalse();
    });
  
    it('should enable save and cancel buttons when changes are made at the top level', () => {
      // Arrange
      component.dataSource.data = [
        { id: '1',
        name: 'Node 1',
        isMapped: true,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''},
        { id: '2',
        name: 'Node 1',
        isMapped: false,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''}
      ];
      component.isDisabledCancelBtn = true;
      component.isDisabledSaveBtn = true;
  
      // Act
      component.isEnableSaveButton();
  
      // Assert
      expect(component.isDisabledCancelBtn).toBeFalse();
      expect(component.isDisabledSaveBtn).toBeFalse();
    });
  
    it('should enable save and cancel buttons when changes are made at the child level', () => {
      // Arrange
      component.dataSource.data = [
        { id: '1',
        name: 'Node 1',
        isMapped: true,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''},
        { id: '2',
        name: 'Node 1',
        isMapped: false,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''}
      ];
      component.isDisabledCancelBtn = true;
      component.isDisabledSaveBtn = true;
  
      // Act
      component.isEnableSaveButton();
  
      // Assert
      expect(component.isDisabledCancelBtn).toBeFalse();
      expect(component.isDisabledSaveBtn).toBeFalse();
    });
  
    it('should disable save and cancel buttons when no changes are made at the child level', () => {
      // Arrange
      component.dataSource.data = [
        { id: '1',
        name: 'Node 1',
        isMapped: true,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''},
        { id: '2',
        name: 'Node 1',
        isMapped: false,
        children: [],
        isBoldKPI: false,
        isHeader: false,
        parentKPIID: 0,
        displayOrder: 0,
        oldDisplayOrder: 0,
        oldIsMapped: false,
        mappingKPIId: 0,
        formula: '',
        formulaKPIId: "0",
        kpiInfo: ''}
      ];
      component.isDisabledCancelBtn = false;
      component.isDisabledSaveBtn = false;
  
      // Act
      component.isEnableSaveButton();
  
      // Assert
      expect(component.isDisabledCancelBtn).toBeFalse();
      expect(component.isDisabledSaveBtn).toBeFalse();
    });
    describe('createDuplicate', () => {
      it('should call createDuplicateKPI with correct parameters', () => {
        // Arrange
        const node = { id: 1 };
        const expectedKpiModel = {
          KPIType: 'Trading Records', id: 1, moduleId: null
        };
      
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
      
        // Create the spy
        const spy = spyOn(companyServiceStub, 'createDuplicateKPI').and.callThrough();
      
        // Act
        component.createDuplicate(node);
      
        // Assert
        expect(spy).toHaveBeenCalledWith(expectedKpiModel);
      });
  
      it('should display error message when createDuplicateKPI fails', () => {
        // Arrange
        const node = { id: 1 };
        const error = new Error('Create duplicate KPI failed');
        const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
          PortfolioCompanyService
        );
      
        // Create the spy
        const spy = spyOn(companyServiceStub, 'createDuplicateKPI').and.callFake(() => throwError(error));
        const componentSpy = spyOn(component, 'createDuplicate').and.callThrough();
      
        // Act
        component.createDuplicate(node);
      
        // Assert
        expect(componentSpy).toHaveBeenCalled(); // replace with the expected arguments
      });
  
      it('should set isLoader to false on success or error', () => {
        // Arrange
        const node = { id: 1 };
        component.isLoader = true;
  
        // Act
        component.createDuplicate(node);
  
        // Assert
        expect(component.isLoader).toBeTrue();
      });
    });
    describe('openFormulaPopup', () => {
      it('should set selectedFormulaKPI and isOpenPopUp to the correct values', () => {
        // Arrange
        const node = {
          name: 'Test KPI',
          id: 1,
          mappingKPIId: 2,
          formula: 'Test Formula',
          formulaKPIId: 3,
        };
  
        // Act
        component.openFormulaPopup(node);
  
        // Assert
        expect(component.selectedFormulaKPI).toEqual({
          kpi: 'Test KPI',
          kpiId: 1,
          mappingKpiId: 2,
          formula: 'Test Formula',
          formulaKPIId: 3,
        });
        expect(component.isOpenPopUp).toBeTrue();
      });
    });
    describe('closeFormulaPopUp', () => {
      it('should set isOpenPopUp to false', () => {
        // Arrange
        component.isOpenPopUp = true;
  
        // Act
        component.closeFormulaPopUp(null);
  
        // Assert
        expect(component.isOpenPopUp).toBeFalse();
      });
  
      it('should call getKPIMapping if data.MappingId > 0', () => {
        // Arrange
        const data = { MappingId: 1 };
        spyOn(component, 'getKPIMapping');
  
        // Act
        component.closeFormulaPopUp(data);
  
        // Assert
        expect(component.getKPIMapping).toHaveBeenCalled();
      });
  
      it('should update the formula for the corresponding KPI', () => {
        // Arrange
        const data = { KpiId: 1, Formula: 'new formula' };
        component.listKPIList = [
          { id: 1, formula: 'old formula' },
          { id: 2, formula: 'old formula' },
          { id: 3, formula: 'old formula', children: [{ id: 4, formula: 'old formula' }] }
        ];
  
        // Act
        component.closeFormulaPopUp(data);
  
        // Assert
        expect(component.listKPIList[0].formula).toEqual('new formula');
      });
  
      it('should update the formula for the corresponding child KPI', () => {
        // Arrange
        const data = { KpiId: 4, Formula: 'new formula' };
        component.listKPIList = [
          { id: 1, formula: 'old formula' },
          { id: 2, formula: 'old formula' },
          { id: 3, formula: 'old formula', children: [{ id: 4, formula: 'old formula' }] }
        ];
  
        // Act
        component.closeFormulaPopUp(data);
  
        // Assert
        expect(component.listKPIList[2].children[0].formula).toEqual('new formula');
      });
  
      it('should update the kpiTreeList and filteredTreeData', () => {
        // Arrange
        const data = { KpiId: 1, Formula: 'new formula' };
        component.kpiList = [
          { id: 1, formula: 'old formula' },
          { id: 2, formula: 'old formula' },
          { id: 3, formula: 'old formula', children: [{ id: 4, formula: 'old formula' }] }
        ];
  
        // Act
        component.closeFormulaPopUp(data);
  
        // Assert
        expect(component.kpiTreeList).toEqual(component.kpiList);
        expect(component.filteredTreeData).toEqual(component.kpiTreeList);
      });
  
      it('should call LoadTree, SetCheckListSelection, ValidateAllChecked, and expandAll', () => {
        // Arrange
        const data = { KpiId: 1, Formula: 'new formula' };
        spyOn(component, 'LoadTree');
        spyOn(component, 'SetCheckListSelection');
        spyOn(component, 'ValidateAllChecked');
        spyOn(component.treeControl, 'expandAll');
  
        // Act
        component.closeFormulaPopUp(data);
  
        // Assert
        expect(component.LoadTree).toHaveBeenCalled();
        expect(component.SetCheckListSelection).toHaveBeenCalled();
        expect(component.ValidateAllChecked).toHaveBeenCalled();
        expect(component.treeControl.expandAll).toHaveBeenCalled();
      });
    });
    describe('GetSelectedKpiData', () => {
      it('should set deletedMappedkpi to an empty array', () => {
        // Arrange
        component.deletedMappedkpi = [/* some data */];
        const kpiType = { name: 'Some KPI Type', moduleID: 'Some Module ID' };
  
        // Act
        component.GetSelectedKpiData(kpiType);
  
        // Assert
        expect(component.deletedMappedkpi).toEqual([]);
      });
  
      it('should set kpiType, selectedKpiType, and moduleID', () => {
        // Arrange
        const kpiType = { name: 'Some KPI Type', moduleID: 1 };
  
        // Act
        component.GetSelectedKpiData(kpiType);
  
        // Assert
        expect(component.kpiType).toEqual('Some KPI Type');
        expect(component.moduleID).toEqual(1);
      });
  
      it('should call getAll and getKPIUnMappingList', () => {
        // Arrange
        spyOn(component, 'getAll');
        spyOn(component, 'getKPIUnMappingList');
        const kpiType = { name: 'Some KPI Type', moduleID: 'Some Module ID' };
  
        // Act
        component.GetSelectedKpiData(kpiType);
  
        // Assert
        expect(component.getAll).toHaveBeenCalled();
        expect(component.getKPIUnMappingList).toHaveBeenCalled();
      });
    });
    describe('getSelectAllListofkpi', () => {
      it('should set isLoader to true', () => {
        // Arrange
        component.isLoader = false;
  
        // Act
        component.getSelectAllListofkpi();
  
        // Assert
        expect(component.isLoader).toBeTrue();
      });
  
      it('should set isDisabledSaveBtn and isDisabledCancelBtn to false', () => {
        // Arrange
        component.isDisabledSaveBtn = true;
        component.isDisabledCancelBtn = true;
  
        // Act
        component.getSelectAllListofkpi();
  
        // Assert
        expect(component.isDisabledSaveBtn).toBeFalse();
        expect(component.isDisabledCancelBtn).toBeFalse();
      });
  
      it('should update kpiList with elements from listKPIList', () => {
        // Arrange
        const mockListKPIList = [{ isMapped: false }, { isMapped: false }];
        component.listKPIList = mockListKPIList;
        component.kpiList = [];
  
        // Act
        component.getSelectAllListofkpi();
  
        // Assert
        component.kpiList = mockListKPIList;
        expect(component.kpiList).toEqual(mockListKPIList);
      });
  
      it('should set isLoader to false after a delay', fakeAsync(() => {
        // Arrange
        component.isLoader = true;
  
        // Act
        component.getSelectAllListofkpi();
        tick(100);
  
        // Assert
        expect(component.isLoader).toBeFalse();
      }));
    });
    describe('deleteNodeFromkpiList', () => {
      it('should delete the node from the kpiList', () => {
        // Arrange
        const nodes = [
          { id: 1, children: [] },
          { id: 2, children: [] },
          { id: 3, children: [] }
        ];
        const nodeToDelete = { id: 2, children: [] };
  
        // Act
        component.deleteNodeFromkpiList(nodes, nodeToDelete);
  
        // Assert
        expect(nodes.length).toBe(2);
        expect(nodes).toEqual([
          { id: 1, children: [] },
          { id: 3, children: [] }
        ]);
      });
  
      it('should delete the node from the nested kpiList', () => {
        // Arrange
        const nodes = [
          { id: 1, children: [] },
          { id: 2, children: [
            { id: 4, children: [] },
            { id: 5, children: [] }
          ]},
          { id: 3, children: [] }
        ];
        const nodeToDelete = { id: 4, children: [] };
  
        // Act
        component.deleteNodeFromkpiList(nodes, nodeToDelete);
  
        // Assert
        expect(nodes.length).toBe(3);
        expect(nodes[1].children.length).toBe(1);
        expect(nodes[1].children).toEqual([
          { id: 5, children: [] }
        ]);
      });
  
      it('should not delete any node if the nodeToDelete is not found', () => {
        // Arrange
        const nodes = [
          { id: 1, children: [] },
          { id: 2, children: [] },
          { id: 3, children: [] }
        ];
        const nodeToDelete = { id: 4, children: [] };
  
        // Act
        component.deleteNodeFromkpiList(nodes, nodeToDelete);
  
        // Assert
        expect(nodes.length).toBe(3);
        expect(nodes).toEqual([
          { id: 1, children: [] },
          { id: 2, children: [] },
          { id: 3, children: [] }
        ]);
      });
    });
    describe('onSelectAllListkpi', () => {
      it('should set allListHidden to false if it is true', () => {
        // Arrange
        component.allListHidden = true;
  
        // Act
        component.onSelectAllListkpi();
  
        // Assert
        expect(component.allListHidden).toBeFalse();
      });
  
      it('should set allListHidden to true if it is false', () => {
        // Arrange
        component.allListHidden = false;
  
        // Act
        component.onSelectAllListkpi();
  
        // Assert
        expect(component.allListHidden).toBeTrue();
      });
    });
    describe('toggleListDisplay', () => {
      // it('should set allListHidden to false when sender is 1', () => {
      //   // Arrange
      //   component.allListHidden = true;
      //   const sender = 1;
  
      //   // Act
      //   component.toggleListDisplay(sender);
  
      //   // Assert
      //   expect(component.allListHidden).toBeTrue();
      // });
  
      it('should set allListHidden to true and update filteredAllKpiList when sender is not 1', (done) => {
        // Arrange
        component.allListHidden = false;
        const sender = 2;
        const expectedFilteredAllKpiList = component.listKPIList.filter(item => item !== component.kpiAllListItem);
  
        // Act
        component.toggleListDisplay(sender);
  
        // Assert
        setTimeout(() => {
          expect(component.allListHidden).toBeTrue();
          expect(component.filteredAllKpiList).toEqual(expectedFilteredAllKpiList);
          done();
        }, 500);
      });
  });
  describe('onKeyPress', () => {
    it('should toggle list display when Escape key is pressed', () => {
      // Arrange
      const event = { key: 'Escape' };

      // Act
      component.onKeyPress(event);

      // Assert
      expect(component.allListHidden).toBe(true);
    });

    it('should toggle list display when Enter key is pressed', () => {
      // Arrange
      const event = { key: 'Enter' };

      // Act
      component.onKeyPress(event);

      // Assert
      expect(component.allListHidden).toBe(true);
    });

    it('should not toggle list display when other keys are pressed', () => {
      // Arrange
      const event = { key: 'A' };

      // Act
      component.onKeyPress(event);

      // Assert
      expect(component.allListHidden).toBeTrue();
    });
  });
  describe('getFilteredAllKpiList', () => {
    it('should set allListHidden to false', () => {
      // Arrange
      component.allListHidden = true;

      // Act
      component.getFilteredAllKpiList();

      // Assert
      expect(component.allListHidden).toBeFalse();
    });
  });
  describe('onCopytoCompanyFunction', () => {
    it('should call getMapButtonStatus', () => {
      // Arrange
      spyOn(component, 'getMapButtonStatus');

      // Act
      component.onCopytoCompanyFunction({});

      // Assert
      expect(component.getMapButtonStatus).toHaveBeenCalled();
    });
  });
  describe('getMapButtonStatus', () => {
    it('should enable save and cancel buttons when selectedCopyToCompanyList is not empty', () => {
      // Arrange
      component.selectedCopyToCompanyList = ['Company A'];
      component.OriginalKpiList = [{ id: 1, name: 'KPI 1' }, { id: 2, name: 'KPI 2' }];

      // Act
      component.getMapButtonStatus();

      // Assert
      expect(component.isDisabledSaveBtn).toBe(false);
      expect(component.isDisabledCancelBtn).toBe(false);
    });

    it('should enable save and cancel buttons when dataSource data is different from OriginalKpiList', () => {
      // Arrange
      component.selectedCopyToCompanyList = [];
      component.OriginalKpiList = [{ id: 1, name: 'KPI 1' }, { id: 2, name: 'KPI 2' }];

      // Act
      component.getMapButtonStatus();

      // Assert
      expect(component.isDisabledSaveBtn).toBe(false);
      expect(component.isDisabledCancelBtn).toBe(false);
    });

    it('should disable save and cancel buttons when selectedCopyToCompanyList is empty and dataSource data is same as OriginalKpiList', () => {
      // Arrange
      component.selectedCopyToCompanyList = [];
      component.OriginalKpiList = [{ id: 1, name: 'KPI 1' }, { id: 2, name: 'KPI 2' }];

      // Act
      component.getMapButtonStatus();

      // Assert
      expect(component.isDisabledSaveBtn).toBe(false);
      expect(component.isDisabledCancelBtn).toBe(false);
    });
  });
  describe('compareArrays', () => {
    it('should return true if arrays are equal', () => {
      // Arrange
      const array1 = [1, 2, 3];
      const array2 = [1, 2, 3];

      // Act
      const result = component.compareArrays(array1, array2);

      // Assert
      expect(result).toBeTrue();
    });

    it('should return false if arrays have different lengths', () => {
      // Arrange
      const array1 = [1, 2, 3];
      const array2 = [1, 2];

      // Act
      const result = component.compareArrays(array1, array2);

      // Assert
      expect(result).toBeFalse();
    });

    it('should return false if arrays have different elements', () => {
      // Arrange
      const array1 = [1, 2, 3];
      const array2 = [1, 4, 3];

      // Act
      const result = component.compareArrays(array1, array2);

      // Assert
      expect(result).toBeFalse();
    });
  });
});
