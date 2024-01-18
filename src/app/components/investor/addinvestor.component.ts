import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestorService } from '../../services/investor.service';
import { InvestorStatic, secureRandom } from "src/app/common/constants";
import { FirmService } from "src/app/services/firm.service";
import { geographicLocations } from "./investor.model";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
@Component({
  selector: 'app-addinvestor',
  templateUrl: './addinvestor.component.html',
  styleUrls: ['./addinvestor.component.scss']
})
export class AddinvestorComponent implements OnInit {
  title: string = "Create";
  resetText: string = "Reset";
  loading: boolean = false;
  investorinfo = InvestorStatic;
  investorfilter: any = {};
  regionList = [];
  countryCloneList = [];
  countryList = [];
  stateCloneList = [];
  stateList = [];
  cityList = [];
  cityCloneList = [];
  investortypes = [];
  dynamicfielddata = [];
  dynamicBusinessData = [];
  dynamicGeoLocationData = [];
  geographicLocationsModel: geographicLocations;
  tablegeographicLocationsModel = [];
  id: string;
  model;
  sideNavWidth:any ="";
  constructor(private _investorService: InvestorService, private toastrService: ToastrService,private miscService: MiscellaneousService, private _avRoute: ActivatedRoute, private firmserv: FirmService) {
    if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];;
			this.title = "Update";
			this.resetText = "Reload";
		}
  }
  getFieldDisplayName(items: any, sectionName: string) {
    let result = items.find(x => x.name == sectionName);
    return (result && result.value) || "";
  }
  getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized($event)
  {
    this.getSideNavWidth();
  }
  ngOnInit(): void {
    this.getConfigurationDetails();
    this.getMasterGeoLocations();
    this.setDefaultValues();
  }


  setDefaultValues() {
		if (this.id != undefined) {
			this.title = "Update";
		}
		else {
			this.model = {};
		}
	}

  clearGeographicLocation(geoForm: any) {
    geoForm.resetForm();
  }
  
  removeLocation(investorId) {
    this.tablegeographicLocationsModel = this.tablegeographicLocationsModel.filter(
      function (ele: any) {
        return investorId != ele.investorId;
      }
    );
  }
  getConfigurationDetails() { 
    this._investorService.getInvestorAddEditConfiuration({ encryptedInvestorId: this.id, paginationFilter: null}).subscribe((result: any) => {
      if (result != null) {
        this.investortypes = result.investorMasterList;
        this.dynamicGeoLocationData = result.geographicLocations;
        this.dynamicfielddata = result.pageConfigurations;
        this.dynamicBusinessData = result.pageConfigurations.filter(x => x.name == this.investorinfo.BusinessDescription);
        if (this.id != undefined){
          let typeId = result.pageConfigurations.find(x => x.name == "InvestorTypeId").value
          if( typeId != null && typeId != "0" && typeId != "NA" && typeId != ""){
            let typeData = result.investorMasterList.find(x => x.investorTypeId.toString() == typeId);
            result.pageConfigurations.find(x => x.name == "InvestorTypeId").value = typeData;
          }
          this.addExistingGeographicLocation( result.investorDetails.investorLocationData);
        }
      }
    });
  }

  getMasterGeoLocations() {
    this._investorService.getMasterGeoLocations().subscribe(
      (result: any) => {
        this.regionList = result?.region;
        this.countryList = result?.locationModel;
        this.stateList = result?.states;
        this.cityList = result?.cities;
        this.stateCloneList = result?.states;
        this.cityCloneList = result?.cities;
        this.countryCloneList = result?.locationModel;
      }
    );
  }
  onRegionChange(value) {
    this.clearLocationSelectedData(this.investorinfo.Region);
    if (value != null || value != undefined) {
      this.countryList = [];
      this.countryList = this.countryCloneList.filter(x => x.regionId === value.regionId);
    }
  }
  clearLocationSelectedData(value:string){
    if(this.dynamicGeoLocationData.length>0){
        switch (value) {
          case this.investorinfo.Region:{
            this.dynamicGeoLocationData.forEach((x, index) => {
              if (x.name != this.investorinfo.Region) {
                x.value = "";
              }
            });
            break;
          }
          case this.investorinfo.Country:{
            this.dynamicGeoLocationData.forEach((x, index) => {
            if(x.name != this.investorinfo.Country && x.name != this.investorinfo.Region){
              x.value = "";
            }
          });
            break;
          }
          case this.investorinfo.State:{
            this.dynamicGeoLocationData.forEach((x, index) => {
            if(x.name != this.investorinfo.Country && x.name != this.investorinfo.Region && x.name != this.investorinfo.State){
              x.value = "";
            }
          });
            break;
          }
        }
    }
   
  }
  onCountryChange(value) {
    this.clearLocationSelectedData(this.investorinfo.Country);
    if (value != null || value != undefined) {
      this.stateList = this.stateCloneList.filter(x => x.countryId === value.countryId);
    }
  }
  onStateChange(value) {
    this.clearLocationSelectedData(this.investorinfo.State);
    if (value != null || value != undefined) {
      this.cityList = this.cityCloneList.filter(x => x.stateId === value.stateId && x.city != '');
    }
  }
  addGeographicLocation(form: any) {
    if (form.valid) {
      this.geographicLocationsModel = <geographicLocations>{};
      this.dynamicGeoLocationData.forEach((x, index) => {
        this.geographicLocationsModel.headquarter = false;
        this.geographicLocationsModel.investorId = Math.floor((secureRandom(100)) + 1);
        if (x.name == this.investorinfo.Region) {
          if (x.value != null && x.value != "") {
            const Region = <any>{};
            Region.regionId = (x.value == null || x.value == "") ? "" : x.value.regionId;
            Region.region = (x.value == null || x.value == "") ? "" : x.value.region;
            this.geographicLocationsModel.region = Region;
          }
        }
        if (x.name == this.investorinfo.Country) {
          if (x.value != null && x.value != "") {
            const Country = <any>{};
            Country.countryId = (x.value == null || x.value == "") ? "" : x.value.countryId;
            Country.country = (x.value == null || x.value == "") ? "" : x.value.country;
            this.geographicLocationsModel.country = Country;
          }
        }
        if (x.name == this.investorinfo.State) {
          if (x.value != null && x.value != "") {
            const State = <any>{};
            State.stateId = (x.value == null || x.value == "") ? "" : x.value.stateId;
            State.state = (x.value == null || x.value == "") ? "" : x.value.state;
            this.geographicLocationsModel.state = State;
          }
        }
        if (x.name == this.investorinfo.City) {
          if (x.value != null && x.value != "") {
            const city = <any>{};
            city.cityId = (x.value == null || x.value == "") ? "" : x.value.cityId;
            city.city = (x.value == null || x.value == "") ? "" : x.value.city;
            this.geographicLocationsModel.city = city;
          }
        }
        if (x.name == this.investorinfo.Headquarter && (x.value != null && x.value != ""))
          this.geographicLocationsModel.headquarter = x.value;
      });
      if (Object.keys(this.geographicLocationsModel).length != 0) {
        this.tablegeographicLocationsModel.push(this.geographicLocationsModel);
      }
      form.form.reset();
    }
  }  

  addExistingGeographicLocation(investorLocationData) {
    this.geographicLocationsModel = <geographicLocations>{};
    
    investorLocationData.forEach(element => {
      this.dynamicGeoLocationData.forEach((x, index) => {
        this.geographicLocationsModel.headquarter = false;
        this.geographicLocationsModel.investorId = Math.floor((secureRandom(100)) + 1);
        if (x.name == this.investorinfo.Region) {
          if (element.region != null && element.region != 0) {
            const Region = <any>{};
            Region.regionId = element.region;
            Region.region = element.regionName;
            this.geographicLocationsModel.region = Region;
          }
        }
        if (x.name == this.investorinfo.Country) {
          if (element.country != null && element.country != 0) {
            const Country = <any>{};
            Country.countryId = element.country;
            Country.country = element.countryName;
            this.geographicLocationsModel.country = Country;
          }
        }
        if (x.name == this.investorinfo.State) {
          if (element.state != null && element.state != 0) {
            const State = <any>{};
            State.stateId = element.state;
            State.state = element.stateName;
            this.geographicLocationsModel.state = State;
          }
        }
        if (x.name == this.investorinfo.City) {
          if (element.city != null && element.city != 0) {
            const city = <any>{};
            city.cityId = element.city;
            city.city = element.cityName;
            this.geographicLocationsModel.city = city;
          }
        }
        if (x.name == this.investorinfo.Headquarter && (element.value != null && element.value != ""))
          this.geographicLocationsModel.headquarter = element.headquarter;
      });
      if (Object.keys(this.geographicLocationsModel).length != 0) {
        this.tablegeographicLocationsModel.push(this.geographicLocationsModel);
        this.geographicLocationsModel = <geographicLocations>{};
      }
    });


  } 
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
          return true;
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  Reload(f: any){
    if(this.id != undefined){
      this.getConfigurationDetails();
    }else{
      f.resetForm();
    }
  }

  AddOrUpdateInvestor(f){
    this._investorService.investorAddEdit({ pageFieldValueModels: this.dynamicfielddata, locations: this.tablegeographicLocationsModel, encryptedInvestorId: this.id }).subscribe(
      (result: any) => {
        if (result != null) {
          if (result.code == "ok") {
            this.tablegeographicLocationsModel = [];

            if(this.id == undefined){
              f.resetForm();
            }
            else{
              this.getConfigurationDetails();
            }

            setTimeout(() => {
              this.loading = false;
              this.toastrService.success(result.message, "", { positionClass: "toast-center-center" });
            }, 1000);
          } else{
            this.toastrService.error(result.message, "", { positionClass: "toast-center-center" });
            this.loading = false;
          }
        }
      });
  }

  save(f: any) {
    this.loading = true;
    if (this.dynamicBusinessData.length > 0) {
      this.dynamicfielddata.filter(x => x.name == this.investorinfo.BusinessDescription)[0].value = this.dynamicBusinessData[0].value;
    }
    if (this.dynamicfielddata.length > 0) {
      this.dynamicfielddata.forEach(x => {
        if (x.name == this.investorinfo.InvestorTypeId) {
          x.value = x.value != "" && x.value != null && x.value.investorTypeId != undefined ? x.value.investorTypeId.toString() : "";
        }
        if (x.name == this.investorinfo.TotalCommitment) {
          x.value = x.value != null && x.value != "" ? x.value.toString() : "";
        }
      });
    }
    this.AddOrUpdateInvestor(f);
  }
}
