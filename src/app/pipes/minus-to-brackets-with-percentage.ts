﻿import { Pipe, PipeTransform } from "@angular/core";
import { MiscellaneousService } from '../services/miscellaneous.service';

@Pipe({
    name: 'minusToBracketsWithPercentage'
})
export class MinusToBracketsWPercentagePipe implements PipeTransform {
	constructor(private miscService: MiscellaneousService) {

	}
	transform(value: any, args?: any): any {
		let isPercentValue : boolean;
		if((value != null && value != ""  && value.indexOf('%') == value.length -1)) {
			isPercentValue = true;
			value = value.replace('%','');      
		}
		if(args == '%'){
			isPercentValue = true;
		}
		if (this.miscService.checkIfStringIsFloat(value) || this.miscService.checkIfStringIsIneger(value)) {
			if (value != undefined && value != null && value != "" && args != "x") {
				value = isPercentValue ? value = value + '%' : value;
				if (value.toString().trim().indexOf('-') == 0) {
					if (args != undefined && args != null && args != "" && args != "%")
						return '<span class="red">' + value.toString().replace('-', '(' + args + " ") + ')' + '</span>';
					else
						return '<span class="red">' + value.toString().replace('-', '(') + ')' + '</span>';

				}
				else {
					if (args != undefined && args != null && args != "" && args != "%" && args != "x")
						return args + " " + value;
					else
						return value;
				}
			}
			else {
				return value;
			}
		}
		else {
			return value;
		}
	}

}


@Pipe({
	name: 'formatNumbers'
})
export class FormatNumbersPipe implements PipeTransform {
	constructor(private miscService: MiscellaneousService) {
		
	}
	transform(value: any, args?: any): any {
		if (value != undefined && value != null && value != "") {
			return this.miscService.formatNumber(value);
		}
		else {
			return value;
		}
	}

}