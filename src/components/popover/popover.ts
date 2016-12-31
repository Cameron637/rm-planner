import { Component } from "@angular/core";
import { ViewController, NavParams } from "ionic-angular";

@Component({
  selector: "popover",
  templateUrl: "popover.html"
})

export class PopoverComponent {
  presets = this.params.get("presets");

  constructor(public viewCtrl: ViewController, public params: NavParams) { }

  close(preset) {
    this.viewCtrl.dismiss(preset);
  }
}
