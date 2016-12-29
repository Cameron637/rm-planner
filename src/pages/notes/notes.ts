import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
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
  max = moment().add(100, "y").format("YYYY");
  dayView = DayViewPage;
  weekView = WeekViewPage;
  notes = "";
  toDoList = [];

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage) {
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
          this.toDoList = toDoList || [{
            done: false,
            name: ""
          }];

          this.saveToDoList();
        });
    }
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
}
