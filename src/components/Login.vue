<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { API_URL } from '../utils/API_URL';
import { useUserStore } from '../stores/user';
import { LoginResponse } from '../../types';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1, 'This is required').email('Must be a valid email'),
      password: z.string().min(1, 'This is required').min(8, 'Too short'),
    })
  ),
});
const [email] = defineField('email');
const [password] = defineField('password');
const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await fetch(API_URL('auth/login'), {
      method: 'POST',
      body: JSON.stringify({ email: values.email, hashedPassword: values.password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to login.');
    const { message, accessToken, refreshToken } = (await res.json()) as LoginResponse;
    console.log(message);
    if (!accessToken || !refreshToken) throw new Error('No authorization');
    userStore.signIn({ accessToken, refreshToken });
    await router.push('/list');
  } catch (e: any) {
    console.error(e.message);
  }
});
</script>
<template>
  <main class="main-content">
    <BCard bg-variant="primary" text-variant="white" header="Sign In" class="text-center form-card">
      <form class="form__container" @submit.prevent="onSubmit">
        <div class="form-input__wrapper">
          <label for="userEmail" class="form-input__label">Email</label>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            v-model="email"
            :class="{ error: errors.email }"
          />
          <BAlert variant="danger" :model-value="!!errors?.email" class="form-input__alert">
            {{ errors?.email }}
          </BAlert>
        </div>
        <div class="form-input__wrapper">
          <label for="userPassword" class="form-input__label">Password</label>
          <input
            type="password"
            name="userPassword"
            id="userPassword"
            v-model="password"
            :class="{ error: errors.password }"
          />
          <BAlert variant="danger" :model-value="!!errors?.password" class="form-input__alert">
            {{ errors?.password }}
          </BAlert>
        </div>
        <BButton type="submit" :disabled="!email || !password">Sign In</BButton>
      </form>
      <div class="link__container">
        <router-link to="/reset">Forgot password?</router-link>
        <router-link to="/register">Create new account</router-link>
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
    .error {
      background-color: var(--bs-danger-border-subtle);
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
