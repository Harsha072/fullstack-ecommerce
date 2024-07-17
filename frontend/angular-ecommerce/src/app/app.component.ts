import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Travel Buddy Shop';

  ngOnInit() {
    document.addEventListener('DOMContentLoaded', function () {
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.getElementById('hamburger');
      const pageContainer = document.querySelector('.page-container');
  
      hamburger.addEventListener('click', function () {
          sidebar.classList.toggle('open');
          pageContainer.classList.toggle('shift');
      });
  });
  }
}
