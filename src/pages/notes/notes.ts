import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { DayViewPage } from "../day-view/day-view";
import { WeekViewPage } from "../week-view/week-view";
import { PopoverComponent } from "../../components/popover/popover";
import { AlertProvider } from "../../providers/alert-provider";
import moment from "moment";

@Component({
  selector: "page-notes",
  templateUrl: "notes.html"
})

export class NotesPage {
  currentDate = this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD");
  list = this.params.get("list") || /(notes|to-do)/.exec(location.hash) || "notes";
  min = moment().subtract(6, "w").startOf("w").format("YYYY-MM-DD");
  max = moment().add(6, "w").endOf("w").format("YYYY-MM-DD");
  dayView = DayViewPage;
  weekView = WeekViewPage;
  notes = "";
  toDoList = [];
  presets = [];
  defaultToDoList = [{
    done: false,
    name: ""
  }];

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage,
    public popoverCtrl: PopoverController, public alertService: AlertProvider) {
    if (this.list === "notes") {
      this.storage.get(`notes-${this.currentDate}`)
        .then(notes => {
          this.notes = notes || "";
          this.saveNotes();
        });
    }

    if (this.list === "to-do") {
      this.storage.get(`to-do-${this.currentDate}`)
        .then(toDoList => {
          this.toDoList = toDoList || this.defaultToDoList;

          this.saveToDoList();
        });
    }

    this.getPresets();
  }

  updateNotes(notes) {
    this.notes = notes;
    this.saveNotes();
  }

  saveNotes() {
    this.storage.set(`notes-${this.currentDate}`, this.notes);
  }

  toggleItemDone(item) {
    item.done = !item.done;
    this.saveToDoList();
  }

  updateItemName(name, item) {
    item.name = name;
    this.saveToDoList();
  }

  removeItem(item) {
    this.toDoList.splice(this.toDoList.findIndex(element => {
      return JSON.stringify(element) === JSON.stringify(item);
    }), 1);

    this.saveToDoList();
  }

  addItem() {
    this.toDoList.push({
      done: false,
      name: ""
    });

    this.saveToDoList();
  }

  reorderItems(indexes) {
    if (indexes.from < this.toDoList.length) {
      let item = this.toDoList[indexes.from];
      this.toDoList.splice(indexes.from, 1);
      this.toDoList.splice(indexes.to, 0, item);

      this.saveToDoList();
    }
  }

  saveToDoList() {
    this.storage.set(`to-do-${this.currentDate}`, this.toDoList);
  }

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

  swipeLeft(event) {
    this.list = "to-do";
    this.goToList();
  }

  swipeRight(event) {
    this.list = "notes";
    this.goToList();
  }

  getPresets() {
    this.storage.get(`notes-view-${this.list}`)
      .then(presets => {
        this.presets = presets || [];
      });
  }

  clearAll() {
    if (this.list === "notes") {
      this.notes = "";
      this.saveNotes();
    } else {
      this.toDoList = this.defaultToDoList;
      this.saveToDoList();
    }
  }

  addToPresets(preset) {
    let data = this.list === "notes" ? this.notes : this.toDoList;

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
    if (this.list === "notes") {
      this.notes = presetData.data;
      this.saveNotes();
    } else {
      this.toDoList = presetData.data;
      this.saveToDoList();
    }
  }

  savePresets() {
    this.storage.set(`notes-view-${this.list}`, this.presets);
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
