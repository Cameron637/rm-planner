import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { MyApp } from "./app.component";
import { DayViewPage } from "../pages/day-view/day-view";
import { WeekViewPage } from "../pages/week-view/week-view";
import { NotesPage } from "../pages/notes/notes";
import { PopoverComponent } from "../components/popover/popover";
import { AlertProvider } from "../providers/alert-provider";

@NgModule({
  declarations: [
    MyApp,
    DayViewPage,
    WeekViewPage,
    NotesPage,
    PopoverComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp, {}, {
        links: [
          { component: DayViewPage, name: "DayView", segment: "day" },
          { component: DayViewPage, name: "DayView", segment: "day/:currentDate" },
          { component: DayViewPage, name: "DayView", segment: "day/:currentDate/:list" },
          { component: WeekViewPage, name: "WeekView", segment: "week" },
          { component: WeekViewPage, name: "WeekView", segment: "week/:currentDate" },
          { component: WeekViewPage, name: "WeekView", segment: "week/:currentDate/:list" },
          { component: NotesPage, name: "Notes", segment: "notes" },
          { component: NotesPage, name: "Notes", segment: "notes/:currentDate" },
          { component: NotesPage, name: "Notes", segment: "notes/:currentDate/:list" }
        ]
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DayViewPage,
    WeekViewPage,
    NotesPage,
    PopoverComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Storage, AlertProvider]
})

export class AppModule { }
