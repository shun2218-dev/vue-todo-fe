<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { API_URL } from '../utils/API_URL';

const route = useRoute();
const email = atob(route.query.auth_key as string);

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      password: z.string().min(1, 'This is required').min(8, 'Too short'),
    })
  ),
});
const [password] = defineField('password');
const onSubmit = handleSubmit(async (values) => {
  try {
    const formBody = { email, hashedPassword: values.password };
    const res = await fetch(API_URL('auth/register/profile'), {
      method: 'POST',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to register profile.');
    const data = await res.json();
    console.log(data);
    return data;
  } catch (e: any) {
    console.error(e.message);
  }
});
</script>
<template>
  <main class="main-content">
    <BCard bg-variant="primary" text-variant="white" header="Sign Up" class="text-center form-card">
      <form class="form__container" @submit.prevent="onSubmit">
        <div class="form-input__wrapper">
          <label for="userEmail" class="form-input__label">Email</label>
          <input
            type="text"
            name="userEmail"
            v-model="email"
            readonly
            aria-readonly="true"
            class="form-input__readonly"
          />
        </div>
        <div class="form-input__wrapper">
          <label for="userPassword" class="form-input__label">Password</label>
          <input type="password" name="userEmail" id="userEmail" v-model="password" />
          <BAlert variant="danger" :model-value="!!errors?.password" class="form-input__alert">{{
            errors?.password
          }}</BAlert>
        </div>
        <BButton type="submit" :disabled="!email || !password">Submit</BButton>
      </form>
      <div class="link__container">
        <router-link to="/login">Already have a account?</router-link>
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
    .form-input__readonly {
      background-color: #c0c0c0;
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
