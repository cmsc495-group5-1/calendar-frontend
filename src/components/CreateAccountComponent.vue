<template>
  <div>
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
            label="First Name"
            v-model="firstName"
            :rules="[rules.required]"
            />
        </VCol>
        <VCol>
          <VTextField
            label="Last Name"
            v-model="lastName"
            :rules="[rules.required]"
            />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTextField label="Password"
            v-model="password"
            :rules="[rules.required, rules.passwordRequirements]"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            />
        </VCol>
        <VCol>
          <VTextField label="Password Confirm"
            v-model="passwordConfirm"
            :rules="[rules.required, () => password == passwordConfirm || 'Passwords must match']"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <slot name="additionalAction" />
        </VCol>
        <VCol>
          <VBtn @click="submitCreateAccount">Create Account</VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { UserCreationFormSubmission } from "@/models/User";

export default defineComponent({
  emits: [ "submit" ],
  setup() {
    return {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirm: "",
      showPassword: false,
      rules: {
        required: (value: string) => !!value || 'Required',
        email: (value: string) => {
          // This email regex: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/examples/v-text-field/prop-validation.vue#L43
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid email'
        },
        passwordRequirements: (value: string) => {
          if (value.length < 8) return "Must be >= 8 characters";
          // TODO
          return true;
        }
      }
    }
  },
  methods: {
    submitCreateAccount() {
      this.$emit("submit", {
        email: this.username,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
        firstName: this.firstName,
        lastName: this.lastName
      } as UserCreationFormSubmission)
    }
  }
});
</script>

<style scoped lang="scss">

</style>
