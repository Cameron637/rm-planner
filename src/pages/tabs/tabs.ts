import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { DayViewPage } from "../day-view/day-view";
import { WeekViewPage } from "../week-view/week-view";
import { NotesPage } from "../notes/notes";
import moment from "moment";

@Component({
    templateUrl: "tabs.html"
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root = DayViewPage;
    tab2Root = WeekViewPage;
    tab3Root = NotesPage;
    tabParams = {
        currentDate: this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD"),
        list: this.params.get("list") || /(daily|backup)/.exec(location.hash) || "daily"
    };

    constructor(public navCtrl: NavController, public params: NavParams) {}
}
