<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Profile from '../components/Profile.vue'
import { ref } from 'vue' 

const leftDrawerOpen = ref(true)

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
    <q-layout view="hHh lpR fFf">
  
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
  
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            Title
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <q-drawer show-if-above v-model='leftDrawerOpen' side="left" behavior="desktop" bordered>
        <Profile></Profile>
        <Profile></Profile>
        <Profile></Profile>
        <Profile></Profile>
        <Profile></Profile>
        <Profile></Profile>
      </q-drawer>
  
      <q-page-container>
        <router-view :drawerOpen="leftDrawerOpen"></router-view>
      </q-page-container>
  
    </q-layout>
  </template>
  