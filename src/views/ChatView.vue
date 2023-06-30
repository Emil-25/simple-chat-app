<template>
    <div class="q-pa-md row justify-center">
      <div style="width: 100%">
        <q-chat-message
          name="me"
          avatar="https://cdn.quasar.dev/img/avatar4.jpg"
          :text="['hey, how are you?']"
          sent
          stamp="7 minutes ago"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="[`doing fine, how r you?`]"
          stamp="4 minutes ago"
        />
      </div>
    </div>

    <q-input filled bottom-slots v-model="text" class="fixed-bottom w-full right-0 sm:mx-auto sm:w-[60%]" :class="{ '!ml-[30%]' : drawerOpen}" label="Label" counter :dense="false">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg">
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-input>
  </template>

<script setup>
    import { ref } from 'vue'
    import { defineProps } from "vue";

    const props = defineProps({
        drawerOpen: Boolean,
    });

    const text = ref('')

    
</script>