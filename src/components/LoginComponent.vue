<template>
  <div>
    <VForm ref="form">
      <VContainer fluid>
        <VRow>
          <VCol>
            <VTextField
              label="Username"
              v-model="username"
              :rules="[rules.required, rules.email]"
              />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              label="Password"
              v-model="password"
              :rules="[rules.required]"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <slot name="additional-action" />
          </VCol>
          <VCol>
            <VBtn @click="submitLogin">Login</VBtn>
          </VCol>
        </VRow>
      </VContainer>
    </VForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { UserLoginFormSubmission } from '@/models/User';

export default defineComponent({
  emits: [ "submit" ],
  setup() {
    return {
      username: "",
      password: "",
      showPassword: false,
      rules: {
        required: (value: string) => !!value || 'Required',
        email: (value: string) => {
          // This email regex: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-text-field/prop-validation.vue#L43
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid email'
        }
      }
    }
  },
  methods: {
    submitLogin() {
      if (!(this.$refs.form as any).validate()) {
        return;
      }
      this.$emit("submit", {
        email: this.username,
        password: this.password
      } as UserLoginFormSubmission);
    }
  }
});
</script>

<style scoped lang="scss">

</style>
