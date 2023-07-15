<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Profile from '../components/Profile.vue'
import { onMounted, ref } from 'vue' 
import { setDoc, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { usersRef, chatRoomsRef } from '../firebase'
import { getCurrentUser } from 'vuefire'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


onMounted(async () => {

    const user = await getCurrentUser()

    await setDoc(doc(usersRef, user.providerData[0].uid), {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        photoURL: user.providerData[0].photoURL,
    }, {merge: true})
    getUsersToChat()

})

const leftDrawerOpen = ref(true)
const prompt = ref(false)
const email = ref('')
const users = ref([])

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

const addToChatList = async (email) => {
    const user = await getCurrentUser()
    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

    const q = query(usersRef, where("email", "==", email));
    const docs = (await getDocs(q)).docs;

    if (docs.length == 0) return

    await updateDoc(doc(usersRef, user.providerData[0].uid), {
        chatWith: arrayUnion(email)
    })

    await updateDoc(doc(usersRef, docs[0].id), {
        chatWith: arrayUnion(user.providerData[0].email)
    })

    await setDoc(doc(chatRoomsRef, (user.providerData[0].uid + docs[0].id)), {
        name: (user.providerData[0].displayName + docs[0].data().name)
    }, {merge: true})
}

const getUsersToChat = async () => {
    const user = await getCurrentUser()

    // Main User
    const q = query(usersRef, where('email', '==', user.providerData[0].email))
    const data = (await getDocs(q)).docs[0].data()
    const chatWith = await data.chatWith

    // Users to Chat with
    chatWith.forEach(async (email) => {
        const q = query(usersRef, where('email', '==', email))
        const data = (await getDocs(q)).docs[0].data()

        users.value.push(data)
    })
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
        <Profile v-for="user of users" :email="user.email"
        ></Profile>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="prompt = true"/>
        </q-page-sticky>


            <q-dialog v-model="prompt" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                    <div class="text-h6">Enter your friend's email address to chat with him/her.</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input dense autofocus v-model="email" @keyup.enter="prompt = false" />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add" @click="addToChatList(email)" v-close-popup />
                    </q-card-actions>
                </q-card>
            </q-dialog>

      </q-drawer>
  
      <q-page-container>
        <router-view :drawerOpen="leftDrawerOpen" ></router-view>
      </q-page-container>
  
    </q-layout>
  </template>
  