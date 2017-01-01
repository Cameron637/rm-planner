import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { DayViewPage } from "../day-view/day-view";
import { NotesPage } from "../notes/notes";
import { PopoverComponent } from "../../components/popover/popover";
import { AlertProvider } from "../../providers/alert-provider";
import moment from "moment";

@Component({
  selector: "page-week-view",
  templateUrl: "week-view.html"
})

export class WeekViewPage {
  currentDate = this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD");
  list = this.params.get("list") || /(goals|layout)/.exec(location.hash) || "goals";
  min = moment().subtract(6, "w").startOf("w").format("YYYY-MM-DD");
  max = moment().add(6, "w").endOf("w").format("YYYY-MM-DD");
  beginWeek = moment(this.currentDate, "YYYY-MM-DD").startOf("w").format("MMM. D, YYYY");
  endWeek = moment(this.currentDate, "YYYY-MM-DD").endOf("w").format("MMM. D, YYYY");
  storageId = this.beginWeek.replace(/(\. |, | )/g, "-").toLowerCase();
  dayView = DayViewPage;
  notesView = NotesPage;
  categories = [];
  daysOfWeek = [];
  presets = [];

  defaultCategories = [
    {
      name: "Spiritual Goals",
      remaining: 0,
      items: []
    },
    {
      name: "Educational Goals",
      remaining: 0,
      items: []
    },
    {
      name: "Exercise Goals",
      remaining: 0,
      items: []
    },
    {
      name: "Career Goals",
      remaining: 0,
      items: []
    },
    {
      name: "Other Goals",
      remaining: 0,
      items: []
    }
  ];

  defaultDaysOfWeek = [
    {
      name: "Sunday",
      date: "",
      notes: ""
    },
    {
      name: "Monday",
      date: "",
      notes: ""
    },
    {
      name: "Tuesday",
      date: "",
      notes: ""
    },
    {
      name: "Wednesday",
      date: "",
      notes: ""
    },
    {
      name: "Thursday",
      date: "",
      notes: ""
    },
    {
      name: "Friday",
      date: "",
      notes: ""
    },
    {
      name: "Saturday",
      date: "",
      notes: ""
    }
  ];

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage,
    public popoverCtrl: PopoverController, public alertService: AlertProvider) {
    if (this.list === "goals") {
      this.storage.get(`categories-${this.storageId}`)
        .then(categories => {
          this.categories = categories || this.defaultCategories;
          this.saveCategories();
        });
    }

    if (this.list === "layout") {
      this.storage.get(`layout-${this.storageId}`)
        .then(days => {
          if (days) {
            this.daysOfWeek = days;
          } else {
            this.daysOfWeek = this.defaultDaysOfWeek;
            let startDay = moment(this.beginWeek, "MMM. D, YYYY").subtract(1, "d");

            this.daysOfWeek.forEach(day => {
              day.date = startDay.add(1, "d").format("MMM. D, YYYY");
            });

            this.saveDaysOfWeek();
          }
        });
    }
    this.getPresets();
  }

  goToList() {
    this.navCtrl.setRoot(WeekViewPage, {
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

  getPresets() {
    this.storage.get(`week-view-${this.list}`)
      .then(presets => {
        this.presets = presets || [];
      });
  }

  removeCategory(category) {
    this.categories.splice(this.categories.findIndex(element => {
      return JSON.stringify(element) === JSON.stringify(category);
    }), 1);

    this.saveCategories();
  }

  removeItem(category, item) {
    if (!item.done) {
      --category.remaining;
    }

    category.items.splice(category.items.findIndex(element => {
      return JSON.stringify(element) === JSON.stringify(item);
    }), 1);

    this.saveCategories();
  }

  addCategory() {
    this.categories.push({
      name: "",
      remaining: 0,
      items: []
    });

    this.saveCategories();
  }

  addItem(category) {
    category.items.push({
      done: false,
      name: ""
    });

    ++category.remaining;
    this.saveCategories();
  }

  updateName(name, object) {
    object.name = name;
    this.saveCategories();
  }

  toggleItemDone(item, category) {
    item.done = !item.done;
    item.done ? --category.remaining : ++category.remaining;
    this.saveCategories();
  }

  saveCategories() {
    this.storage.set(`categories-${this.storageId}`, this.categories);
  }

  saveDaysOfWeek() {
    this.storage.set(`layout-${this.storageId}`, this.daysOfWeek);
  }

  updateWeekDay(notes, day) {
    day.notes = notes;
    this.saveDaysOfWeek();
  }

  clearAll() {
    if (this.list === "goals") {
      this.categories = this.defaultCategories;
      this.saveCategories();
    } else {
      this.daysOfWeek = this.defaultDaysOfWeek;
      let startDay = moment(this.beginWeek, "MMM. D, YYYY").subtract(1, "d");

      this.daysOfWeek.forEach(day => {
        day.date = startDay.add(1, "d").format("MMM. D, YYYY");
      });

      this.saveDaysOfWeek();
    }
  }

  addToPresets(preset) {
    let data = this.list === "goals" ? this.categories : this.daysOfWeek;

    this.presets.push({
      name: preset,
      data: data
    });

    this.savePresets();
  }

  removeFromPresets(preset) {
    this.presets.splice(this.presets.findIndex(element => element.name === preset), 1);
    this.savePresets();
  }

  usePreset(preset) {
    let presetData = this.presets.find(element => element.name === preset);

    if (this.list === "goals") {
      this.categories = presetData.data;
      this.saveCategories();
    } else {
      this.daysOfWeek = presetData.data;
      this.saveDaysOfWeek();
    }
  }

  savePresets() {
    this.storage.set(`week-view-${this.list}`, this.presets);
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
}
