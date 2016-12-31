import { Injectable } from '@angular/core';
import { AlertController } from "ionic-angular";

@Injectable()

export class AlertProvider {
  dataToReturn;

  constructor(public alertCtrl: AlertController) {}

  createPreset(presets) {
    let alert = this.alertCtrl.create({
      message: "Enter the name of this preset.",
      title: "Create New Preset",
      inputs: [
        {
          name: "preset",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          role: "cancel",
          text: "Cancel"
        },
        {
          text: "Save",
          handler: (data) => {
            if (data.preset) {
              let exists = false;

              presets.forEach(preset => {
                if (preset.name === data.preset) {
                  exists = true;
                }
              });

              if (exists) {
                let confirm = this.alertCtrl.create({
                  title: "Existing Preset",
                  message: `The preset ${data.preset} already exists.  Do you wish to overwrite?`,
                  buttons: [
                    {
                      role: "cancel",
                      text: "Cancel"
                    },
                    {
                      role: "danger",
                      text: "Overwrite",
                      handler: () => {
                        this.dataToReturn = { preset: data.preset, functions: [ "add", "remove" ]};
                      }
                    }
                  ]
                });

                confirm.present();

                confirm.onDidDismiss(() => {
                  alert.dismiss(this.dataToReturn);
                });
              } else {
                this.dataToReturn = { preset: data.preset, functions: ["add"] };
                alert.dismiss(this.dataToReturn);
              }
            }

            return false;
          }
        }
      ]
    });

    return alert;
  }

  removePreset() {
    let alert = this.alertCtrl.create({
      message: "Enter the name of the preset you wish to remove.",
      title: "Delete a Preset",
      inputs: [
        {
          name: "preset",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          role: "cancel",
          text: "Cancel"
        },
        {
          text: "Delete",
          handler: (data) => {
            if (data.preset) {
              this.dataToReturn = { preset: data.preset, functions: ["remove"] };
              alert.dismiss(this.dataToReturn);
            }

            return false;
          }
        }
      ]
    });

    return alert;
  }
}
