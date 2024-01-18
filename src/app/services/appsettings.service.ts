import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AppConfig } from "../common/models";

@Injectable({
  providedIn: 'root'
})
export class AppSettingService {
  myAppUrl: string = "";
  appName : string ;
  AppConfiguration:any= {
    "AppName" :"Foliosure",    
    "DefaultNumberSystem"  : "1000000",
    "DefaultDateFormat": "mm-dd-yyyy",
    "DefaultDateTimeFormat": "mm-dd-yyyy"
  };
  constructor(private _http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.myAppUrl = baseUrl;
    this.appName = window.location.href.replace(window.location.hash, '');
  }
  getAppConfiguration() {

    return this._http.get<any>(this.myAppUrl + "api/appconfiguration/get").pipe(
      map((response) => response),
      catchError(this.errorHandler)
    );
  }

  setGetConfig(): Promise<AppConfig> {
    let name = this.appName + "_config";
    return new Promise<AppConfig>((resolve, reject) => {
      let appConfig: AppConfig = this._getConfig();
      if(appConfig != null) {
        return resolve (appConfig);
      }
      else {
        this.getAppConfiguration().subscribe(
          (res) => {
            this.removeConfig();
            let isWorkflow:boolean = res?.isWorkflow || false;
            let appConfig: AppConfig = {
              AppName: this.appName || "",
              IsWorkflowEnable : isWorkflow || false,
              DefaultNumberSystem: Number.isInteger(
                parseInt(this.AppConfiguration["DefaultNumberSystem"])
              )
                ? Number(this.AppConfiguration["DefaultNumberSystem"])
                : 1000000,
              DefaultDateFormat: this.AppConfiguration["DefaultDateFormat"],
              WorkflowDefaultDateFormat:this.AppConfiguration["WorkflowDefaultDateFormat"],
            };
            sessionStorage.setItem(name, JSON.stringify(appConfig));
               return resolve (appConfig);
          });
      }
    });

  }

  removeConfig() {
    let name = this.appName + "_config";
    sessionStorage.removeItem(name);
  }
  _getConfig(): AppConfig {
    let name = this.appName + "_config";
    let config = JSON.parse(sessionStorage.getItem(name));
    if (config != undefined && config != null) {
      let appConfig: AppConfig = {
        AppName: this.appName || "",
        IsWorkflowEnable : config["IsWorkflowEnable"] || false,
        DefaultNumberSystem: Number.isInteger(
          parseInt(config["DefaultNumberSystem"])
        )
          ? Number(config["DefaultNumberSystem"])
          : 1000000,
        DefaultDateFormat: config["DefaultDateFormat"],
        WorkflowDefaultDateFormat:config["WorkflowDefaultDateFormat"],
      };
      return appConfig;
    }
    else
      return null;
  }

   getConfig() { 
    return this._getConfig();
  }

  errorHandler(error: any) {
    return throwError(error);
  }
}