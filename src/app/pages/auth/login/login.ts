import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { EncryptDecryptService } from '../../../services/encrypt-decrypt.service';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarOne,
    FooterOne
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  isLoading: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private encryptService: EncryptDecryptService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    Aos.init();
    this.initForms();
  }

  initForms() {
    this.loginForm = this.fb.group({
      email_id: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  // ---------------- LOGIN ----------------
  handleLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email_id, password } = this.loginForm.value;
    this.apiService.postData('/userLogin', {
      email_id: this.encryptService.set(email_id),
      password: this.encryptService.set(password),
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.globalService.success(res.message);
          const userData = res.userDetails;

          localStorage.setItem("Authorization", this.encryptService.set(userData.auth_token));

          let user: any;
          user = {
            userid: userData.id,
            userName: this.encryptService.get(userData.username),
            mobileNumber: this.encryptService.get(userData.cnumber),
            userEmail: userData.emailid,
            roleid: userData.roleid,
            loggedIn: true
          };

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userLoginData", JSON.stringify(userData));
          this.globalService.userLogin(user);
          this.router.navigate(['/']);

        } else {
          this.globalService.error(res.message);
        }
      }, error: (error: any) => {
        this.isLoading = false;
        this.globalService.error('An error occurred. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // ---------------- UI HELPERS ----------------
  viewPassword(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
