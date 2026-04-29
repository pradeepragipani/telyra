import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarOne } from "../../../components/navbar/navbar-one/navbar-one";
import Aos from 'aos';
import { FooterOne } from "../../../components/footer/footer-one/footer-one";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptDecryptService } from '../../../services/encrypt-decrypt.service';
import { ApiService } from '../../../services/api.service';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarOne,
    FooterOne
],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  isLoading: boolean = false;
  otpLoading: boolean = false;
  registerForm!: FormGroup;
  otpForm!: FormGroup;
  passwdStrength = false;
  otpModalOpen = false;
  otpMessage = 'Enter the 6-digit OTP sent to your email or mobile number.';
  otpSuccessText = '';
  registrationReference: { email?: string; cnumber?: string } = {};
  tokenKey: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private globalService: GlobalService,
    private apiService: ApiService,
    private encryptService: EncryptDecryptService,
  ) { }

  ngOnInit(): void {
    Aos.init();
    this.initForms();
  }

  initForms() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email_id: ['', [Validators.required, Validators.minLength(3)]],
      cnumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.initOtpForm();
  }

  initOtpForm() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  passwordsMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword;
  }

  // ---------------- REGISTER ----------------
  handleRegister() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const { username, password, cnumber, email_id } = this.registerForm.value;
    this.apiService.postData('userRegistration', {
      username: this.encryptService.set(username),
      password: this.encryptService.set(password),
      cnumber: this.encryptService.set(cnumber),
      email_id: this.encryptService.set(email_id),
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.globalService.success(res.message);
          this.tokenKey = res.userDetails.auth_token;
          this.registrationReference = {
            email: email_id,
            cnumber
          };
          this.otpModalOpen = true;
          this.otpMessage = 'A 6-digit verification code has been sent. Please enter it to complete registration.';
          this.registerForm.reset();
          this.initOtpForm();
        } else {
          this.globalService.error(res.message);
        }
        this.cdr.detectChanges();
      }, error: (err) => {
        this.isLoading = false;
        this.globalService.error('An error occurred. Please try again.');
        console.error('Registration error:', err);
        this.cdr.detectChanges();
      }, complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ---------------- PASSWORD CHECK ----------------
  passwordCheck(passwd: string) {
    const upper = /[A-Z]/.test(passwd);
    const lower = /[a-z]/.test(passwd);
    const number = /[0-9]/.test(passwd);
    const special = /[!@#$%^&*?_~]/.test(passwd);

    this.passwdStrength = !(passwd.length > 7 && upper && lower && number && special);

    this.registerForm.patchValue({ password: passwd });
  }

  handleVerifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.otpLoading = true;
    const otp = this.otpForm.value.otp;

    const payload: any = {
      otp: otp
    };

    if (this.registrationReference.email) {
      payload.email_id = this.encryptService.set(this.registrationReference.email);
    }

    if (this.registrationReference.cnumber) {
      payload.cnumber = this.encryptService.set(this.registrationReference.cnumber);
    }

    this.apiService.postDataWithHeaders(
      'validateOtp', payload, { 'Authorization': `Bearer ${this.tokenKey}` }
    ).subscribe({
      next: (res: any) => {
        // this.otpLoading = false;
        if (res.code === 0) {
          this.otpSuccessText = res.message || 'OTP verified successfully. Redirecting to login...';
          this.globalService.success(this.otpSuccessText);
          setTimeout(() => this.router.navigate(['/login']), 2500);
        } else {
          this.globalService.error(res.message || 'OTP verification failed.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.otpLoading = false;
        this.globalService.error('OTP verification failed. Please try again.');
        console.error('OTP verification error:', err);
        this.cdr.detectChanges();
      }, complete: () => {
        this.otpLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeOtpModal() {
    this.otpModalOpen = false;
  }

  // ---------------- UI HELPERS ----------------
  viewPassword(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
