import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NavController, NavParams, ActionSheetController } from "ionic-angular";
import { DayViewPage } from "../day-view/day-view";
import { NotesPage } from "../notes/notes";
import moment from "moment";

@Component({
  selector: "page-week-view",
  templateUrl: "week-view.html"
})

export class WeekViewPage {
  currentDate = this.params.get("currentDate") || /\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(location.hash) || moment().format("YYYY-MM-DD");
  list = this.params.get("list") || /(goals|layout)/.exec(location.hash) || "goals";
  max = moment().add(100, "y").format("YYYY");
  beginWeek = moment(this.currentDate).startOf("w").format("MMM. D, YYYY");
  endWeek = moment(this.currentDate).endOf("w").format("MMM. D, YYYY");
  storageId = this.beginWeek.replace(/(\. |, | )/g, "-").toLowerCase();
  dayView = DayViewPage;
  notesView = NotesPage;
  modify = false;
  categories;
  daysOfWeek;

  constructor(public navCtrl: NavController, public params: NavParams, public storage: Storage, public actionSheetCtrl: ActionSheetController) {
    if (this.list === "goals") {
      this.storage.get(`categories-${this.storageId}`)
        .then(categories => {
          this.categories = categories || [
            {
              name: "Spiritual Goals",
              items: []
            },
            {
              name: "Educational Goals",
              items: []
            },
            {
              name: "Exercise Goals",
              items: []
            },
            {
              name: "Career Goals",
              items: []
            },
            {
              name: "Other Goals",
              items: []
            }
          ];

          this.updateCategories();
        });
    }

    if (this.list === "layout") {
      this.storage.get(`layout-${this.storageId}`)
        .then(days => {
          if (days) {
            this.daysOfWeek = days;
          } else {
            this.daysOfWeek = [
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

            let startDay = moment(this.beginWeek).subtract(1, "d");

            this.daysOfWeek.forEach(day => {
              day.date = startDay.add(1, "d").format("MMM. D, YYYY");
            });

            this.updateDaysOfWeek();
          }
        });
    }
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

  toggleModify() {
    this.modify = !this.modify;
  }

  deleteCategory(category) {
    this.categories.splice(this.categories.findIndex(element => {
      return JSON.stringify(element) === JSON.stringify(category);
    }), 1);

    this.updateCategories();
  }

  deleteItem(category, item) {
    category.items.splice(category.items.findIndex(element => {
      return JSON.stringify(element) === JSON.stringify(item);
    }), 1);

    this.updateCategories();
  }

  updateName(name, object) {
    object.name = name;
    this.updateCategories();
  }

  updateGoal(goal, item) {
    item.goal = goal;
    this.updateCategories();
  }

  updateActual(actual, item) {
    item.actual = actual;
    this.updateCategories();
  }

  updateCategories() {
    this.storage.set(`categories-${this.storageId}`, this.categories);
  }

  updateDaysOfWeek() {
    this.storage.set(`layout-${this.storageId}`, this.daysOfWeek);
  }

  updateWeekDay(notes, day) {
    day.notes = notes;
    this.updateDaysOfWeek();
  }

  moreOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Modify Categories/Goals",
      buttons: [
        {
          role: "destructive",
          text: "Delete Categories/Goals",
          handler: () => {
            this.toggleModify();
          }
        },
        {
          text: "Add Category",
          handler: () => {
            this.categories.push({
              name: "",
              items: []
            });
          }
        },
        {
          text: "Add Goal",
          handler: () => {
            let buttons = [];
            let newActionSheet;

            this.categories.forEach(category => {
              if (category.name) {
                buttons.push({
                  text: category.name,
                  handler: () => {
                    category.items.push({
                      actual: "",
                      name: "",
                      goal: ""
                    });
                  }
                });
              }
            });

            buttons.push({
              role: "cancel",
              text: "Cancel",
              handler: () => {
              }
            });

            newActionSheet = this.actionSheetCtrl.create({
              title: "Select a Category",
              buttons: buttons
            });

            newActionSheet.present();
          }
        },
        {
          role: "cancel",
          text: "Cancel",
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }
}
