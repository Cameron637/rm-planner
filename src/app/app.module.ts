import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { MyApp } from "./app.component";
import { TabsPage } from "../pages/tabs/tabs";
import { DayViewPage } from "../pages/day-view/day-view";
import { WeekViewPage } from "../pages/week-view/week-view";
import { NotesPage } from "../pages/notes/notes";

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    DayViewPage,
    WeekViewPage,
    NotesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: "bottom"
    }, {
        links: [
          { component: DayViewPage, name: "DayView", segment: "day" },
          { component: DayViewPage, name: "DayView", segment: "day/:currentDate" },
          { component: DayViewPage, name: "DayView", segment: "day/:currentDate/:list" },
          { component: WeekViewPage, name: "WeekView", segment: "week" },
          { component: WeekViewPage, name: "WeekView", segment: "week/:currentDate" },
          { component: NotesPage, name: "Notes", segment: "notes" }
        ]
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    DayViewPage,
    WeekViewPage,
    NotesPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Storage]
})

export class AppModule { }
