import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {

    const observer = {
      next: (item: unknown) => console.log(`Une boite arrive ${item}`),
      error: (err: unknown) => console.log(`Oups il ya une erreur ${err}`),
      complete: () => console.log('terminé...plus rien')
    };

  }
}
