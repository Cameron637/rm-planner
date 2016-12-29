import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, NavParams } from "ionic-angular";
import { WeekViewPage } from "../week-view/week-view";
import { NotesPage } from "../notes/notes";
import moment from "moment";

@Component({
  selector: "page-day-view",
  templateUrl: "day-view.html"
})

export class DayViewPage {
  currentDate = this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD");
  list = this.params.get("list") || /(daily|backup)/.exec(location.hash) || "daily";
  min = moment().subtract(6, "w").startOf("w").format("YYYY-MM-DD");
  max = moment().add(6, "w").endOf("w").format("YYYY-MM-DD");
  dailyPlans = [];
  backupPlans = [];
  weekView = WeekViewPage;
  notesView = NotesPage;

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage) {
    let hour = moment().startOf("d").add(6, "h");

    for (let i = 0; i < 27; ++i) {
      let plan = {
        hour: i < 3 ? hour.add(1, "h").format("h:mm") : hour.add(30, "m").format("h:mm"),
        key: `${this.list}-${this.currentDate}-${hour.format("h:mm")}`,
        value: ""
      };

      this.list === "daily" ? this.dailyPlans.push(plan) : this.backupPlans.push(plan);
    }

    this.getPlans();
  }

  getPlans() {
    let plansList = this.list === "daily" ? this.dailyPlans : this.backupPlans;

    plansList.forEach(plan => {
      this.storage.get(plan.key)
        .then(value => {
          plan.value = value;
        });
    });
  }

  savePlans(value, key) {
    this.storage.set(key, value);
  }

  goToList() {
    this.navCtrl.setRoot(DayViewPage, {
      currentDate: this.currentDate,
      list: this.list
    }, {
        animate: false
      });
  }

  openPage(page) {
    this.navCtrl.setRoot(page, {
      currentDate: this.currentDate
    }, {
        animate: false
      });
  }
}
