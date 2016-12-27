import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, NavParams } from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import moment from "moment";

@Component({
  selector: "page-day-view",
  templateUrl: "day-view.html"
})

export class DayViewPage {
  currentDate = this.params.get("currentDate");
  list = this.params.get("list");
  max = moment().add(100, "y").format("YYYY");
  dailyPlans = [];
  backupPlans = [];

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage) {
    let hour = moment().startOf("d").add(6, "h");

    for (let i = 0; i < 27; ++i) {
      let plan = {
        hour: i < 3 ? hour.add(1, "h").format("h:mm") : hour.add(30, "m").format("h:mm"),
        id: `${hour.format("h:mm")}`,
        value: ""
      };

      this.dailyPlans.push(plan);
      this.backupPlans.push(Object.assign({}, plan));
    }

    this.getPlans();
  }

  getPlans() {
    this.dailyPlans.forEach(plan => {
      this.storage.get(`daily-${this.currentDate}-${plan.id}`)
        .then(value => {
          plan.value = value;
        });
    });

    this.backupPlans.forEach(plan => {
      this.storage.get(`backup-${this.currentDate}-${plan.id}`)
        .then(value => {
          plan.value = value;
        });
    });
  }

  savePlans(target) {
    this.storage.set(target.parentNode.id, target.value);
  }

  goToList() {
    this.navCtrl.push(TabsPage, {
      tab: "day",
      currentDate: this.currentDate,
      list: this.list
    });
  }
}
