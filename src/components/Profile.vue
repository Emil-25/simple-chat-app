<template>
  <router-link :to="'/chat/' + email">
    <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-avatar>
          <img v-if="chattingWith" :src="chattingWith.photoURL" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ chattingWith.name }}</q-item-label>
        <q-item-label v-if="messages.value && messages.value.length > 0" caption>{{
          messages.value.at(-1).message ? messages.value.at(-1).message : 'Image'
        }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="messages.value && messages.value.length > 0" caption>{{
          new Date(messages.value.at(-1).time.seconds * 1000).toLocaleString().split(',')[1]
        }}</q-item-label>
      </q-item-section>
    </q-item>
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue'
import { doc, query, where, getDocs, collection, getDoc } from 'firebase/firestore'
import { ref, reactive } from 'vue'
import { useCurrentUser, useCollection } from 'vuefire'
import { chatRoomsRef, usersRef } from '../firebase'

const props = defineProps({
  email: String
})

const currentUser = useCurrentUser()
const user = currentUser['_rawValue']
let chattingWith = ref('')
let messages = reactive({})
let chattingWithId

const getChattingWith = async () => {
  const q = query(usersRef, where('email', '==', props.email))
  chattingWith.value = (await getDocs(q)).docs[0].data()
  chattingWithId = (await getDocs(q)).docs[0].id
  getMessagesRef()
}

const getMessagesRef = async () => {
  let docRef = doc(chatRoomsRef, `${user.providerData[0].uid + chattingWithId}`)
  let exists = false

  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    exists = true
  } else {
    exists = false
    docRef = doc(chatRoomsRef, `${chattingWithId + user.providerData[0].uid}`)
  }

  messages.value = useCollection(collection(docRef, 'messages'))
}
getChattingWith()
</script>
