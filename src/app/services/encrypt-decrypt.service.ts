import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }
  // The set method is use for encrypt the value.
  set(value: { toString: () => string; }): string {
    const key = CryptoJS.enc.Utf8.parse('Digitalt0kenKey2025broAdMind2025');
    const iv = CryptoJS.enc.Utf8.parse('Digitalt0kenAuth');
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  // The get method is use for decrypt the value.
  get(value: string | CryptoJS.lib.CipherParams): string {
    const key = CryptoJS.enc.Utf8.parse('Digitalt0kenKey2025broAdMind2025');
    const iv = CryptoJS.enc.Utf8.parse('Digitalt0kenAuth');
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
