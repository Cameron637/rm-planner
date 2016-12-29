import { Component } from "@angular/core";
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

  constructor(public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
