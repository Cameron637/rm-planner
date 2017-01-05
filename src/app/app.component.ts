import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Platform } from "ionic-angular";
import { StatusBar, Splashscreen } from "ionic-native";
import { DayViewPage } from "../pages/day-view/day-view";
import moment from "moment";

@Component({
  templateUrl: "app.html"
})

export class MyApp {
  rootPage = DayViewPage;
  defaultParams = {
    currentDate: moment().format("YYYY-MM-DD"),
    list: "daily"
  };

  constructor(public platform: Platform, public storage: Storage) {
    this.initializeApp();
  }

  initializeApp() {
    let sixWeeksAgo = moment().subtract(6, "w").startOf("w").format("YYYY-MM-DD");
    let sixWeeksFromNow = moment().add(6, "w").endOf("w").format("YYYY-MM-DD");

    this.storage.forEach((value, key, i) => {
      let keyDate = moment(/\d{4}-(1[0-2]|0[1-9])-([0-2][[1-9]|3[0-1])/.exec(key));

      if (keyDate.isBefore(sixWeeksAgo) || keyDate.isAfter(sixWeeksFromNow)) {
        this.storage.remove(key);
      }
    });

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
