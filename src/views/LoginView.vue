<template>
    <button @click="signUp">Sign In</button>
</template>

<script setup>
    import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

    const provider = new GoogleAuthProvider();

    const auth = getAuth();

    const signUp = () => {signInWithRedirect(auth, provider)}

</script>