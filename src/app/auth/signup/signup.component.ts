import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authServiceSubscription: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authServiceSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  public onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
  }
}
