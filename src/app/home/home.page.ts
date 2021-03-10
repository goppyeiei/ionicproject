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
  today: any;

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

          date: e.payload.doc.data()['date'.toString()],
          time: e.payload.doc.data()['time'.toString()],
          place: e.payload.doc.data()['place'.toString()],
          program: e.payload.doc.data()['program'.toString()],
          check: e.payload.doc.data()['check'.toString()],
          color: e.payload.doc.data()['color'.toString()],
        };
      });
      this.allList = _.orderBy(this.allList, 'time', 'desc');
      this.allList = _.orderBy(this.allList, 'date', 'desc');
      this.today = Date.now();
    });
  }

  // ADD
  async ADD() {
    const alert = this.alertCtrlin.create({
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
        {
          name: 'place',
          type: 'text',
          placeholder: 'Place',
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
            const todolist = {
              program: data.program,
              date: data.date,
              time: data.time,
              place: data.place,
              check: false,
              color: '#a4b0be',
            };

            if (
              data.program == '' ||
              data.date == '' ||
              data.time == '' ||
              data.place == ''
            ) {
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
    const alert = this.alertCtrlin.create({
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
    const todolist = {};
    const alert = this.alertCtrlin.create({
      header: 'EDIT',
      inputs: [
        {
          name: 'program',
          type: 'text',
          placeholder: 'Program name',
          value: todo.program,
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
        {
          name: 'place',
          type: 'text',
          placeholder: 'Place',
          value: todo.place,
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
            if (data.program == '' && data.place == '') {
              todolist['program'] = todo.program;
              todolist['date'] = data.date;
              todolist['time'] = data.time;
              todolist['place'] = todo.place;

              this.CurdService.updateDataIn(todo.id, todolist);
            } else if (data.program == '') {
              todolist['program'] = todo.program;
              todolist['date'] = data.date;
              todolist['time'] = data.time;
              todolist['place'] = todo.place;

              this.CurdService.updateDataIn(todo.id, todolist);
            } else if (data.date == '') {
              todolist['program'] = data.program;
              todolist['date'] = todo.date;
              todolist['time'] = data.time;
              todolist['place'] = data.place;

              this.CurdService.updateDataIn(todo.id, todolist);
            } else if (data.time == '') {
              todolist['program'] = data.program;
              todolist['date'] = data.date;
              todolist['time'] = todo.time;
              todolist['place'] = data.place;

              this.CurdService.updateDataIn(todo.id, todolist);
            } else if (data.place == '') {
              todolist['program'] = data.program;
              todolist['date'] = data.date;
              todolist['time'] = data.time;
              todolist['place'] = todo.place;

              this.CurdService.updateDataIn(todo.id, todolist);
            } else {
              todolist['program'] = data.program;
              todolist['date'] = data.date;
              todolist['time'] = data.time;
              todolist['place'] = data.place;
              this.CurdService.updateDataIn(todo.id, todolist);
            }
          },
        },
      ],
    });
    (await alert).present();
  }

  // CHECK
  CHECK(i: { check: boolean; id: any }) {
    const check = {};
    const color = {};

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
