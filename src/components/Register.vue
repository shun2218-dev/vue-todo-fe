<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { SEND_MAIL } from '../utils/SEND_MAIL';
import { useMailStore } from '../stores/mail';

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1, 'This is required').email('Must be a valid email'),
    })
  ),
});

const mailStore = useMailStore();
const [email] = defineField('email');
const onSubmit = handleSubmit(async (values) => {
  const baseUrl = new URL(
    import.meta.env.NODE_ENV === 'production'
      ? import.meta.env.VITE_URL!
      : import.meta.env.VITE_URL_DEV!
  );
  const query = new URLSearchParams(baseUrl.searchParams);
  query.set('auth_key', btoa(values.email));
  const register_profile = `${baseUrl}#/register/profile?${query.toString()}`;
  const templateParams = {
    to_email: values.email,
    from_name: 'Todo App',
    message: `${baseUrl}register/profile`,
    link: register_profile,
  };
  await SEND_MAIL(templateParams);
});
mailStore.resetState();
</script>
<template>
  <main class="main-content">
    <BCard bg-variant="primary" text-variant="white" header="Sign Up" class="text-center form-card">
      <form class="form__container" @submit.prevent="onSubmit" v-if="!mailStore.isEmailSent">
        <div class="form-input__wrapper">
          <label for="userEmail" class="form-input__label">Email</label>
          <input type="text" name="userEmail" id="userEmail" v-model="email" />
          <BAlert variant="danger" :model-value="!!errors?.email" class="form-input__alert">
            {{ errors?.email }}
          </BAlert>
        </div>
        <BButton type="submit" :disabled="!email">Send Email</BButton>
      </form>
      <div class="link__container" v-if="!mailStore.isEmailSent">
        <router-link to="/login">Already have a account?</router-link>
      </div>
      <div class="send-complete" v-else>
        <BAlert variant="success" class="form-input__alert" v-model="mailStore.isEmailSent">
          <p>
            Email has sent to
            <code> {{ email }} </code>.
          </p>
          <p>So please check your email.</p>
        </BAlert>
      </div>
    </BCard>
  </main>
</template>
<style scoped lang="scss">
.form-card {
  width: 600px;
  max-width: 80%;
  margin: 3% auto;
}
.form__container {
  margin: 10% 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  .form-input__wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    .form-input__label {
      align-self: flex-start;
      margin-bottom: 0.5rem;
    }
    .form-input__alert {
      margin-top: 1rem;
    }
  }
  @media screen and (min-width: 768px) {
    max-width: 500px;
    margin: 10% auto;
  }
}
.link__container {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
</style>
