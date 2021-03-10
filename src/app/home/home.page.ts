import { Component } from '@angular/core';
import { CurdService } from '../CrudService';
import { AlertController } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  allList: any;


  constructor(
    private CurdService: CurdService,
    private alertCtrlin: AlertController
  ) {}
  ngOnInit(): void {
    this.CurdService.readData().subscribe((data) => {
      this.allList = data.map((e) => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          program: e.payload.doc.data()['program'.toString()],
          date: e.payload.doc.data()['date'.toString()],
          time: e.payload.doc.data()['time'.toString()],
          check: e.payload.doc.data()['check'.toString()],
          color: e.payload.doc.data()['color'.toString()],
        };
      });
      this.allList = _.orderBy(this.allList, 'time', 'desc');
      this.allList = _.orderBy(this.allList, 'date', 'desc');
    });
  }

  // ADD
  async ADD() {
    let alert = this.alertCtrlin.create({
      header: 'Enter your Todo',
      inputs: [
        {
          name: 'program',
          type: 'text',
          placeholder: 'Program name',
        },
        {
          name: 'date',
          type: 'date',
        },
        {
          name: 'time',
          type: 'time',
        },
      ],
      buttons: [
        {
          text: 'CANCLE',
          role: 'cancel',
          handler: (data) => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'ADD',
          handler: (data) => {
            let todolist = {
              program: data.program,
              date: data.date,
              time: data.time,
              check: false,
              color: '#a4b0be',
            };
            if (data.program == "" || data.date == "" || data.time == ""){
              return false;
            } else {
              this.CurdService.createData(todolist);
            }

          },
        },
      ],
    });
    (await alert).present();
  }

  // Delete
  async DEL(todo: any) {
    let alert = this.alertCtrlin.create({
      header: 'DELETE',
      message: 'Do you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Deleted');

            this.CurdService.delDataIn(todo.id);
          },
        },
      ],
    });

    (await alert).present();
  }

  // Edit
  async EDIT(todo: any) {
    let todolist = {};
    let alert = this.alertCtrlin.create({
      header: 'EDIT',
      inputs: [
        {
          name: 'program',
          type: 'text',
          placeholder: todo.program,
          value: todo.name,
        },
        {
          name: 'date',
          type: 'date',
          placeholder: todo.date,
          value: todo.date,
        },
        {
          name: 'time',
          type: 'time',
          placeholder: todo.time,
          value: todo.time,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data) => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Update',
          handler: (data) => {
            if (data.program == '') {
              todolist['program'] = todo.program;
              todolist['date'] = data.date;
              todolist['time'] = data.time;
              this.CurdService.updateDataIn(todo.id, todolist);
            } else if (data.date == '') {
              todolist['program'] = data.program;
              todolist['date'] = todo.date;
              todolist['time'] = data.time;
              this.CurdService.updateDataIn(todo.id, todolist);
            } else if (data.time == '') {
              todolist['program'] = data.program;
              todolist['date'] = data.date;
              todolist['time'] = todo.time;
              this.CurdService.updateDataIn(todo.id, todolist);
            } else {
              todolist['program'] = data.program;
              todolist['date'] = data.date;
              todolist['time'] = data.time;
              this.CurdService.updateDataIn(todo.id, todolist);
            }
          },
        },
      ],
    });
    (await alert).present();
  }

  // CHECK
  CHECK(i: { check: boolean; id: any; }) {
    let check = {};
    let color = {};

    if (i.check === true) {
      check['check'] = false;
      color['color'] = '#a4b0be';
      this.CurdService.updateDataIn(i.id, check);
      this.CurdService.updateDataIn(i.id, color);
    } else {
      check['check'] = true;
      color['color'] = '#2ed573';
      this.CurdService.updateDataIn(i.id, check);
      this.CurdService.updateDataIn(i.id, color);
    }
  }
}
