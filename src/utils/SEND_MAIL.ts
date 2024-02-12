import { MailTemplate } from '../../types';
import { useMailStore } from './../stores/mail';

import emailjs from '@emailjs/browser';

emailjs.init({
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY!,
});

export const SEND_MAIL = async (templateParams: MailTemplate) => {
  try {
    const mailStore = useMailStore();
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        templateParams
      )
      .then((res) => console.log(res.status))
      .catch((err) => console.log(err.message));
    mailStore.sendMail();
  } catch (e: any) {
    console.error(e);
  }
};
