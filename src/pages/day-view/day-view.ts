import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { WeekViewPage } from "../week-view/week-view";
import { NotesPage } from "../notes/notes";
import { PopoverComponent } from "../../components/popover/popover";
import { AlertProvider } from "../../providers/alert-provider";
import moment from "moment";

@Component({
  selector: "page-day-view",
  templateUrl: "day-view.html"
})

export class DayViewPage {
  currentDate = this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD");
  list = this.params.get("list") || /(daily|backup)/.exec(location.hash) || "daily";
  max = moment().add(100, "y").format("YYYY");
  dailyPlans = [];
  backupPlans = [];
  presets = [];
  weekView = WeekViewPage;
  notesView = NotesPage;

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage,
    public popoverCtrl: PopoverController, public alertService: AlertProvider) {
    let hour = moment().startOf("d").add(6, "h");

    for (let i = 0; i < 27; ++i) {
      let plan = {
        hour: i < 3 ? hour.add(1, "h").format("h:mm a") : hour.add(30, "m").format("h:mm a"),
        display: hour.format("h:mm"),
        done: false,
        key: `${this.list}-${this.currentDate}-${hour.format("h:mm-a")}`,
        value: ""
      };

      this.list === "daily" ? this.dailyPlans.push(plan) : this.backupPlans.push(plan);
    }

    this.getPlans();
    this.getPresets();
  }

  getPlans() {
    let plansList = this.list === "daily" ? this.dailyPlans : this.backupPlans;

    plansList.forEach(plan => {
      this.storage.get(plan.key)
        .then(savedPlan => {
          if (savedPlan) {
            console.log(savedPlan);
            plan.value = savedPlan.value;
            plan.done = savedPlan.done;
            console.log(plan);
          }
        });
    });
  }

  getPresets() {
    this.storage.get("day-view-presets")
      .then(presets => {
        this.presets = presets || [];
      });
  }

  addToPresets(preset) {
    let plans = this.list === "daily" ? this.dailyPlans : this.backupPlans;

    this.presets.push({
      name: preset,
      data: plans.map(plan => {
        return { hour: plan.hour, value: plan.value, done: plan.done };
      })
    });

    this.savePresets();
  }

  removeFromPresets(preset) {
    this.presets.splice(this.presets.findIndex(element => element.name === preset), 1);
    this.savePresets();
  }

  usePreset(preset) {
    let plans = this.list === "daily" ? this.dailyPlans : this.backupPlans;
    let presetPlans = this.presets.find(element => element.name === preset) || [];

    plans.forEach(plan => {
      let presetPlan = presetPlans.data.find(element => element.hour === plan.hour);

      if (presetPlan) {
        plan.value = presetPlan.value;
        plan.done = presetPlan.done;
        this.savePlans(plan);
      } else {
        plan.value = "";
        plan.done = false;
        this.savePlans(plan);
      }
    });
  }

  clearAll() {
    let plans = this.list === "daily" ? this.dailyPlans : this.backupPlans;

    plans.forEach(plan => {
      plan.value = "";
      plan.done = false;
      this.savePlans(plan);
    });
  }

  savePresets() {
    this.storage.set("day-view-presets", this.presets);
  }

  togglePlanDone(plan) {
    plan.done = !plan.done;
    this.savePlans(plan);
  }

  updateValue(value, plan) {
    plan.value = value;
    this.savePlans(plan);
  }

  savePlans(plan) {
    this.storage.set(plan.key, plan);
  }

  createPopover(event) {
    let popover = this.popoverCtrl.create(PopoverComponent, {
      presets: this.presets
    });

    popover.present({
      ev: event
    });

    popover.onDidDismiss(preset => {
      if (preset) {
        let alert;

        if (preset === "new") {
          alert = this.alertService.createPreset(this.presets);
        } else if (preset === "remove") {
          alert = this.alertService.removePreset();
        } else if (preset === "clear") {
          this.clearAll();
        } else {
          this.usePreset(preset);
        }

        if (alert) {
          alert.present();

          alert.onDidDismiss(data => {
            if (data) {
              data.functions.forEach(functionToCall => {
                if (functionToCall === "add") {
                  this.addToPresets(data.preset);
                } else if (functionToCall === "remove") {
                  this.removeFromPresets(data.preset);
                }
              });
            }
          });
        }
      }
    });
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

  swipeLeft(event) {
    this.list = "backup";
    this.goToList();
  }

  swipeRight(event) {
    this.list = "daily";
    this.goToList();
  }
}
