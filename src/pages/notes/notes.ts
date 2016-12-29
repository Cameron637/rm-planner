import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { DayViewPage } from "../day-view/day-view";
import { WeekViewPage } from "../week-view/week-view";
import moment from "moment";

@Component({
  selector: "page-notes",
  templateUrl: "notes.html"
})

export class NotesPage {
  currentDate = this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD");
  list = this.params.get("list") || /(notes|to-do)/.exec(location.hash) || "notes";
  dayView = DayViewPage;
  weekView = WeekViewPage;

  constructor(public navCtrl: NavController, public params: NavParams) { }

  goToList() {
    this.navCtrl.setRoot(NotesPage, {
      currentDate: this.currentDate,
      list: this.list
    }, {
        animate: false
      })
  }

  openPage(page) {
    this.navCtrl.setRoot(page, {
      currentDate: this.currentDate
    }, {
        animate: false
      });
  }
}
