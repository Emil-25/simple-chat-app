<template>
    <div class="w-full h-screen flex justify-center items-center flex-col">
        <h1 class="text-accent text-center">Start Chatting</h1>
        <img src="../assets/images/chat.png" alt="image">
        <q-btn color="accent" @click="signUp">Sign In With Google <img class="w-[50px]" src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google Icon"></q-btn>
    </div>
</template>

<script setup>
    import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
    import { useRouter } from 'vue-router'


    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    const router = useRouter()

    const signUp = () => {signInWithRedirect(auth, provider); router.push('/')}

</script>