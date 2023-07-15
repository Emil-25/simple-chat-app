<template>
    <div>
        <div class="q-pa-md row justify-center">
        <div style="width: 100%" >
    
            <q-chat-message v-for="msg of messages.value" v-if="messages.value"
            :name="msg.from"
            :text="[msg.message]"
            :avatar="msg.from == user.providerData[0].displayName? user.providerData[0].photoURL : chattingWith.photoURL"
            :sent="msg.from == user.providerData[0].displayName? true : false"
            :stamp="msg.time? new Date(msg.time.seconds*1000).toLocaleString().split(',')[1]: 'none'"
            />
            
        </div>
        </div>

        <q-input filled bottom-slots v-model="text" class="fixed-bottom w-full right-0 sm:mx-auto sm:w-[60%]" :class="{ '!ml-[40%]' : props.drawerOpen}" label="Label" counter :dense="false">
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
            <q-btn round dense flat icon="send" @click="sendMessage(text)" />
            </template>
        </q-input>
    </div>
  </template>

<script setup>
    import { doc, query, where, getDocs, collection, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
    import { onBeforeMount, onMounted, ref, watch } from 'vue'
    import { defineProps } from "vue";
    import { useCurrentUser, useCollection } from 'vuefire'
    import { chatRoomsRef, usersRef } from '../firebase'
    import { useRoute } from 'vue-router'

    const text = ref('')
    const currentUser = useCurrentUser()
    const user = currentUser['_rawValue']
    let chattingWith = ref('')
    let messages = ref([])
    let chattingWithId;
    let messagesRef;
    const route = useRoute()
    const props = defineProps({
        drawerOpen: Boolean,
    });

    const getChattingWith = async () => {
            const q = query(usersRef, where("email", "==", route.params.chat));
            chattingWith = (await getDocs(q)).docs[0].data()
            chattingWithId = (await getDocs(q)).docs[0].id
            getMessagesRef()
    } 


    const getMessagesRef = async () => {
        let docRef = doc(chatRoomsRef, `${user.providerData[0].uid + chattingWithId}`)
        let exists = false

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            exists = true
        } else {
            exists = false
            docRef = doc(chatRoomsRef, `${chattingWithId + user.providerData[0].uid}`)
        }

        messagesRef = collection(docRef, 'messages');
        messages.value = useCollection(collection(docRef, 'messages'));
    }

    getChattingWith()

    const sendMessage = async (text) => {
        await setDoc(doc(messagesRef, `${Date.now()}`), {
            from: user.providerData[0].displayName,
            time: serverTimestamp(),
            message: text
        })
    }

    watch(() => route.path, (newPath) => {
        getChattingWith()
    }, {flush: 'pre', immediate: true, deep: true})


</script>