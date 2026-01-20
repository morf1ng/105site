'use client'
import { useEffect } from 'react';

export default function ContactForm() {
  useEffect(() => {
    const form   = document.getElementById('contactsForm') as HTMLFormElement | null;
    const nameEl = document.getElementById('contactName')   as HTMLInputElement | null;
    const phoneEl= document.getElementById('contactPhone')  as HTMLInputElement | null;

    if (!form || !nameEl || !phoneEl) return;

    const formatPhone = (raw: string) => {
      let digits = raw.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (digits.length && !digits.startsWith('7')) digits = '7' + digits;
      if (digits.length > 11) digits = digits.slice(0, 11);

      let out = '+7';
      if (digits.length > 1) out += ' (' + digits.slice(1, 4);
      if (digits.length > 4) out += ') ' + digits.slice(4, 7);
      if (digits.length > 7) out += '-' + digits.slice(7, 9);
      if (digits.length > 9) out += '-' + digits.slice(9, 11);
      return out;
    };

    const onPhoneInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const caret  = target.selectionStart ?? 0;
      const before = target.value.slice(0, caret);
      target.value = formatPhone(target.value);
      target.setSelectionRange(before.length, before.length);

      if (target.classList.contains('error') && target.value.replace(/\D/g, '').length === 11) {
        validate(target);
      }
    };

    const onPhoneKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && (e.target as HTMLInputElement).value.length <= 4) {
        e.preventDefault();
        (e.target as HTMLInputElement).value = '';
      }
    };

    phoneEl.addEventListener('input',  onPhoneInput);
    phoneEl.addEventListener('keydown',onPhoneKeydown);

    const validate = (field: HTMLInputElement) => {
      const val = field.value.trim();
      let ok = true;

      if (field === nameEl) {
        ok = val.length >= 2;
      } else if (field === phoneEl) {
        const digits = val.replace(/\D/g, '');
        ok = digits.length === 11 && digits.startsWith('7');
      }

      field.classList.toggle('error', !ok);
      return ok;
    };

    nameEl.addEventListener('blur', () => validate(nameEl));
    phoneEl.addEventListener('blur',() => validate(phoneEl));

    const onSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      const okName  = validate(nameEl);
      const okPhone = validate(phoneEl);

      if (okName && okPhone) {
        console.log('Form is valid:', { name: nameEl.value, phone: phoneEl.value });
        // здесь fetch / axios / telegram-bot и т.д.
        // form.submit();
      }
    };

    form.addEventListener('submit', onSubmit);

    return () => {
      phoneEl.removeEventListener('input',   onPhoneInput);
      phoneEl.removeEventListener('keydown', onPhoneKeydown);
      nameEl.removeEventListener('blur', () => validate(nameEl));
      phoneEl.removeEventListener('blur',() => validate(phoneEl));
      form.removeEventListener('submit', onSubmit);
    };
  }, []);

  return (
    <form className="contacts__form" id="contactsForm" action="">
        <input type="text" id="contactName" placeholder="Имя*" className="contacts__input" required name="name"/>
        <input type="tel" id="contactPhone" placeholder="Телефон*" className="contacts__input" required name="phone"/>
        <button type="submit" className="hero__left-link">Обсудить проект</button>
    </form>
  );
}