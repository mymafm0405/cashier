import { User } from './shared/user.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from './shared/app.service';
import { Company } from './shared/company.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cashier-v1';
  user: User;
  userType: string;
  userLoggedIn = false;
  signInSub: Subscription;
  company: Company;

  constructor(private appService: AppService) {}

  @ViewChild('addForm', { static: false }) addForm: NgForm;

  ngOnInit() {
    this.appService.loadCategories();
    this.appService.loadItems();
    this.appService.loadBills();
    this.appService.loadClients();
    this.appService.loadAllUsers();
    this.appService.loadCompanies();
    console.log(this.appService.getTodayDate());
    this.appService.getOpenDiscountStatus();

    this.signInSub = this.appService.userSignInStatusChanges.subscribe(
      (status: boolean) => {
        if (status) {
          this.user = this.appService.getUser();
          this.userType = this.appService.getUserType();
          this.company = this.appService.getCompanyById(this.user.companyId);
        }
        this.userLoggedIn = status;
      }
    );
  }

  onSignOut() {
    this.userLoggedIn = false;
    this.user = undefined;
    this.userType = undefined;
  }

  ngOnDestroy() {
    this.signInSub.unsubscribe();
  }
}
