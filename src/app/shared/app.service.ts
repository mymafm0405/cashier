import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  addCategoryStatus = new Subject<boolean>();
  loadCategoryStatus = new Subject<boolean>();

  loadItemsStatus = new Subject<boolean>();
  addItemStatus = new Subject<boolean>();

  userType = 'admin';
  categories: Category[] = [];
  items: Item[] = [];

  constructor(private http: HttpClient) {}

  // All about categories from here...
  addCategory(category: Category) {
    this.http
      .post(
        'https://cashier-v1-b2d37-default-rtdb.firebaseio.com/categories.json',
        category
      )
      .subscribe(
        (res: { name: string }) => {
          console.log(res.name);
          this.categories.push({ ...category, id: res.name });
          this.addCategoryStatus.next(true);
          console.log(this.categories);
        },
        (error) => {
          this.addCategoryStatus.next(false);
          console.log(error);
        }
      );
  }

  loadCategories() {
    this.http
      .get(
        'https://cashier-v1-b2d37-default-rtdb.firebaseio.com/categories.json'
      )
      .pipe(
        map((resData): Category[] => {
          const resCat: Category[] = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              resCat.push({ ...resData[key], id: key });
            }
          }
          return resCat;
        })
      )
      .subscribe(
        (resCat: Category[]) => {
          this.categories = resCat;
          this.loadCategoryStatus.next(true);
        },
        (error) => {
          console.log(error);
          this.loadCategoryStatus.next(false);
        }
      );
  }

  getCategories() {
    return this.categories;
  }

  getCategoryById(catId: string) {
    return this.categories.find((cat) => cat.id === catId);
  }
  // End of categories

  // All about Items from here
  loadItems() {
    this.http
      .get('https://cashier-v1-b2d37-default-rtdb.firebaseio.com/items.json')
      .pipe(
        map((resData): Item[] => {
          const resItems: Item[] = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              resItems.push({ ...resData[key], id: key });
            }
          }
          return resItems;
        })
      )
      .subscribe(
        (resItems: Item[]) => {
          this.items = resItems;
          this.loadItemsStatus.next(true);
        },
        (error) => {
          console.log(error);
          this.loadItemsStatus.next(false);
        }
      );
  }

  addItem(item: Item) {
    this.http
      .post(
        'https://cashier-v1-b2d37-default-rtdb.firebaseio.com/items.json',
        item
      )
      .subscribe((res: { name: string }) => {
        this.items.push({ ...item, id: res.name });
        this.addItemStatus.next(true);
      });
  }

  updateItemQuantity(itemId: string, newQuantity: number) {
    this.http
      .patch(
        'https://cashier-v1-b2d37-default-rtdb.firebaseio.com/items/' +
          itemId +
          '.json',
        { quantity: newQuantity }
      )
      .subscribe(() => {
        this.loadItems();
        // this.items.find(item => item.id === itemId).quantity = newQuantity;
      });
  }

  updateItemPrice(itemId: string, newPrice: number) {
    this.http
      .patch(
        'https://cashier-v1-b2d37-default-rtdb.firebaseio.com/items/' +
          itemId +
          '.json',
        { price: newPrice }
      )
      .subscribe(() => {
        this.loadItems();
        // this.items.find(item => item.id === itemId).quantity = newQuantity;
      });
  }

  getItems() {
    return this.items;
  }

  getItemsForCat(catId: string) {
    return this.items.filter((item) => item.catId === catId);
  }

  getItemById(itemId: string) {
    return this.items.find((item) => item.id === itemId);
  }

  // End of items.

  // All about users
  getUserType() {
    return this.userType;
  }
  // End of users
}
