<template>
  <div class="d-flex flex-column fill-height">
    <VToolbar flat color="green white--text">
      Calendar - Authentication Required
    </VToolbar>
    <VContainer fluid class="fill-height d-flex justify-center align-center">
      <LoginComponent v-if="currentView == CurrentLoginView.Login" @submit="$emit('login', $event)">
        <template #additionalAction>
          <VBtn color="primary" @click="currentView = CurrentLoginView.CreateAccount">No Account? Create One</VBtn>
        </template>
      </LoginComponent>
      <CreateAccountComponent v-else @submit="$emit('create-account', $event)">
        <template #additionalAction>
          <VBtn color="primary" @click="currentView = CurrentLoginView.Login">Have Account? Login</VBtn>
        </template>
      </CreateAccountComponent>
    </VContainer>
  </div>
</template>

<script lang="ts">
import LoginComponent from "@/components/LoginComponent.vue";
import CreateAccountComponent from "@/components/CreateAccountComponent.vue";
import { defineComponent } from "@vue/composition-api";

const CurrentLoginView = {
  Login: 'Login',
  CreateAccount: 'CreateAccount'
}

export default defineComponent({
  components: {
    LoginComponent,
    CreateAccountComponent
  },
  emits: [ "create-account", "login" ],
  setup() {
    return {
      currentView: CurrentLoginView.Login,
      CurrentLoginView
    };
  }
})
</script>

<style scoped lang="scss">
.align-center {
  align-items: center;
}
</style>