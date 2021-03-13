import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../shared/app.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[];
  loadStatusSub: Subscription;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.loadCategoryStatus.subscribe((status: boolean) => {
      if (status) {
        this.categories = this.appService.getCategories();
      } else {
        console.log('An error happened while loading our categories!');
      }
    });
  }

  ngOnDestroy() {
    this.loadStatusSub.unsubscribe();
  }
}