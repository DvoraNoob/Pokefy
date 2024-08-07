<script setup>
import { ref, onMounted } from 'vue';

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "882e5eeefe254dd08afce2aaa90e5d01";
const redirectUri = "http://localhost:5173/callback";
const scopes = ["user-top-read"];

const token = ref(null);

const getTokenFromHash = () => {
  const hash = window.location.hash.substring(1).split("&").reduce((initial, item) => {
    if (item) {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
  window.location.hash = "";
  return hash.access_token;
};

const loginSpotify = () => {
  const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
  window.location.href = loginUrl;
};

onMounted(() => {
  const _token = getTokenFromHash();
  if (_token) {
    token.value = _token;
  }
});
</script>

<template>
  <header>
    <h1 class="logo">Pokéfy Cards</h1>
  </header>

  <main>
    <h3 class="description">Get your favorite artists as Pokémon cards.</h3>

    <div>ima</div>

    <button v-if="!token" class="loginBTN" @click="loginSpotify">Login with Spotify</button>

  </main>

  <footer>Created by Gabriel E Dvoranen</footer>
</template>

<style scoped>
header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2rem;

  background-color: var(--color-background-mute);
}

.logo {
  font-family: Pokemon-Solid, Roboto;
  font-size: 2rem;

  letter-spacing: 0.25rem;
  word-spacing: 0.25rem;

  paint-order: stroke fill;
  color: var(--pokemon-yellow);
  -webkit-text-stroke: 0.4rem var(--pokemon-blue);
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.description{
  text-align: center;
  font-size: 1.5rem;
}

.loginBTN {
  width: 300px;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: 700;

  font-family: Spotify-Font, Roboto;
  background-color: var(--spotify-green);

  border-radius: 999px;
}

footer {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  background-color: var(--color-background-mute);
}
</style>
