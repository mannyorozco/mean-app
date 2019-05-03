import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authServiceSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authServiceSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  public onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
  }
}
