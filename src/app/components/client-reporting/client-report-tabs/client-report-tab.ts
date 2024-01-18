import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { AdhocPeriodType } from "src/app/services/miscellaneous.service";
import { AdhocDataScroll } from "../client-reporting-model";
@Component({
	selector: 'client-report-tabs',
	templateUrl: './client-report-tab.html',
	styleUrls: ['./client-report-tab.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ClientReportTabs implements OnInit {
	@Output() onSelectedActiveTab = new EventEmitter<any>();
	@ViewChild("panel", { read: ElementRef }) public panel: ElementRef<any>;
	@Input() defaultSelectedTab: string;
	@Input() selectedPeriodType: any;
	@Input() adhocDataScroll: AdhocDataScroll[] = [];
	enableRight: boolean = false;
	enableLeft: boolean = false;
	showLeftScroll: boolean = false;
	showRightScroll: boolean = true;
	constructor(protected changeDetectorRef: ChangeDetectorRef) {
	}
	ngOnInit() {
		// existing functionality
	}
	convertStringToInt(str) {
		let Num = parseInt(str);
		return Num;
	}
	ngOnChanges(changes: SimpleChanges) {
		if (this.selectedPeriodType.label == AdhocPeriodType.Monthly) {
			this.defaultSelectedTab = this.adhocDataScroll[0].MonthYear;
			this.enableRight=this.adhocDataScroll.length>11?true:false;
		}
	}
	moveRight() {
		let scroll = 300;
		let remainingScroll =
			this.panel.nativeElement.scrollWidth -
			(this.panel.nativeElement.offsetWidth +
				this.panel.nativeElement.scrollLeft);
		if (remainingScroll > 2) {
			this.enableLeft = false;
			this.enableRight = true;
		}
		else {
			this.enableLeft = true;
			this.enableRight = false;
		}
		if (remainingScroll > scroll && remainingScroll < scroll * 2) {
			scroll = remainingScroll;
		}
		try {
			this.panel.nativeElement.scrollTo({
				left: this.panel.nativeElement.scrollLeft + scroll,
				top: 0,
				behavior: "smooth",
			});
		} catch {
			this.panel.nativeElement.scrollLeft =
				this.panel.nativeElement.scrollLeft + scroll;
		}
		setTimeout(
			function (local: any) {
				local.setScrollButtonVisibility();
			},
			500,
			this
		);
	}
	rightScrollTimer: any;
	leftScrollTimer: any;
	startLeftScrolling() {
		this.leftScrollTimer = setInterval(
			function (local: any) {
				local.moveLeft();
			},
			500,
			this
		);
	}
	startRightScrolling() {
		this.rightScrollTimer = setInterval(
			function (local: any) {
				local.moveRight();
			},
			500,
			this
		);
	}
	propagateChange = (_: any) => { };
	stopLeftScrolling() {
		clearInterval(this.leftScrollTimer);
	}
	stopRightScrolling() {
		clearInterval(this.rightScrollTimer);
	}


	moveLeft() {
		if (this.panel.nativeElement.scrollLeft > 1) {
			this.enableRight = false;
			this.enableLeft = true;
		}
		else {
			this.enableRight = true;
			this.enableLeft = false;
		}
		try {
			this.panel.nativeElement.scrollLeft.scrollTo({
				left: this.panel.nativeElement.scrollLeft - 300,
				top: 0,
				behavior: "smooth",
			});
		} catch {
			this.panel.nativeElement.scrollLeft =
				this.panel.nativeElement.scrollLeft - 300;
		}

		setTimeout(
			function (local: any) {
				local.setScrollButtonVisibility();
			},
			500,
			this
		);
	}
	setScrollButtonVisibility() {
		this.changeDetectorRef.detectChanges();
		if (
			this.panel.nativeElement.offsetWidth +
			this.panel.nativeElement.scrollLeft ==
			this.panel.nativeElement.scrollWidth
		) {
			this.stopRightScrolling();
			this.showRightScroll = false;
		} else {
			this.showRightScroll = true;
		}
		if (this.panel.nativeElement.scrollLeft == 0) {
			this.stopLeftScrolling();
			this.showLeftScroll = false;
		} else {
			this.showLeftScroll = true;
		}
	}
	changeTabType(tab: any) {
		this.defaultSelectedTab = tab?.MonthYear;
		this.onSelectedActiveTab.emit(tab);
	}
}