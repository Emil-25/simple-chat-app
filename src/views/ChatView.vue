<template>
    <div>
        <div class="h-[calc(100vh-145px)] overflow-scroll overflow-x-hidden">
            <div class="q-pa-md row justify-center">
            <div style="width: 100%">
                <q-chat-message v-for="msg of messages.value" v-if="messages.value"
                    :name="msg.from"
                    :avatar="msg.from == user.providerData[0].displayName? user.providerData[0].photoURL : chattingWith.photoURL"
                    :sent="msg.from == user.providerData[0].displayName? true : false"
                    :stamp="msg.time? new Date(msg.time.seconds*1000).toLocaleString().split(',')[1]: 'none'"
                >
                <div v-if="msg.message">
                    {{ msg.message }}
                </div>
                <div v-if="msg.img">
                    <img :src="msg.img" alt="Image">
                </div>
                </q-chat-message>
            
            </div>
            </div>
        </div>

        <div class="fixed-bottom w-full right-0 sm:mx-auto sm:w-[60%] flex flex-row" :class="{ '!ml-[40%]' : props.drawerOpen}">
            
            <q-file outlined v-model="file" class="max-w-[300px]" label="Attach image..." accept=".jpg, image/*" @rejected="alert('Only images are allowed!')">
                <template v-slot:prepend>
                    <q-icon name="attach_file" />
                </template>
            </q-file>

            <q-input filled bottom-slots v-model="text"  label="Label" counter :dense="false" @keyup.enter="sendMessage()" class="w-full">

            <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
            </template>

            <template v-slot:hint>
                Smile)
            </template>

            <template v-slot:after>
                <q-btn round dense flat icon="send" @click="sendMessage()" />
            </template>
        </q-input>
        </div>

    </div>
  </template>

<script setup>
    import { doc, query, where, getDocs, collection, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
    import { uploadBytes, getDownloadURL } from "firebase/storage";
    import { ref as storageRef } from "firebase/storage";
    import { onMounted, ref, watch, defineProps } from 'vue'
    import { useCurrentUser, useCollection } from 'vuefire'
    import { chatRoomsRef, usersRef, imagesRef } from '../firebase'
    import { useRoute } from 'vue-router'

    const text = ref('')
    const file = ref('')
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

    const sendMessage = async () => {
        if (file.value == '') {
            if (text.value == '') return;

            await setDoc(doc(messagesRef, `${Date.now()}`), {
                from: user.providerData[0].displayName,
                time: serverTimestamp(),
                message: text.value
            })

        } else {
            const date = Date.now().toString()
            await uploadBytes(storageRef(imagesRef, (file.value.name + date)), file.value)
            const url = await getDownloadURL(storageRef(imagesRef, (file.value.name + date)))
            console.log(url)

            if (text.value != '') {
                await setDoc(doc(messagesRef, `${Date.now()}`), {
                    from: user.providerData[0].displayName,
                    time: serverTimestamp(),
                    message: text.value,
                    img: url
                })
            } else {
                await setDoc(doc(messagesRef, `${Date.now()}`), {
                    from: user.providerData[0].displayName,
                    time: serverTimestamp(),
                    img: url
                })
            }
        }

        text.value = '';
        file.value = '';
    }

    watch(() => route.path, (newPath) => {
        getChattingWith()
    }, {flush: 'pre', immediate: true, deep: true})


</script>