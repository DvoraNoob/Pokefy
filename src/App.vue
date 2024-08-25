<template>
  <header>
    <div class="logo-container">
      <a href="#">
        <h1 class="logo">Pokéfy</h1>
      </a>
    </div>
  </header>

  <main v-if="token" class="main-container">
    <div class="description-container">
        <h3 class="description">Your favorite artists as Pokémon cards.</h3>
      </div>

    <div class="main-safeArea-container">
      <div class="sample-container">
        <img src="./assets/sample.png" alt="" width="100%">
      </div>

      <div class="buttons-container">
        <button class="login-btn spotify" @click="loginSpotify">
          Login with Spotify
        </button>
      </div>
    </div>
  </main>

  <Deck v-else-if="!token" :bearer="token"/>

  <footer>
    <a href="#">Created by Gabriel E Dvoranen</a>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Deck from "./components/Deck.vue";

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "882e5eeefe254dd08afce2aaa90e5d01";
const redirectUri = "http://localhost:5173/callback"
const scopes = ["user-top-read"];

const token = ref(null);

const getTokenFromHash = () => {
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
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
  const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token&show_dialog=true`;
  window.location.href = loginUrl;
};

onMounted(() => {
  const _token = getTokenFromHash();
  if (_token) {
    token.value = _token;
    localStorage.setItem('spotify_token', _token);
  } else {
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      token.value = storedToken;
    }
  }
});


</script>

<style scoped>

header {
  width: 100%;
  height: 80px;
  position: sticky;
  top: 0;

  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;

  background-color: var(--color-background);
}

header:last-child {
  justify-content: flex-end;
}

.logo-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
}

.logo-container a {
  padding: 0 20% 20%;
}

.logo {
  font-family: Pokemon-Solid;
  font-size: 2rem;

  paint-order: stroke fill;
  color: var(--pokemon-yellow);
  -webkit-text-stroke: 0.4rem var(--pokemon-blue);
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-safeArea-container {
  min-width: 320px;
  max-width: 500px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.description-container {
  width: 100%;
  padding: 20px 2%;

  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;

  background-color: var(--color-background-mute);
}

.description {
  font-family: var(--safeFonts);
  font-size: 1.2rem;
  text-align: center;
}

.sample-container {
  width: 100%;
  padding: 40px 0;

  flex: 1;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
}

.buttons-container {
  width: 100%;
  max-height: 50%;
  padding: 40px 2%;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
}

.login-btn {
  width: 80%;

  padding: 1rem;
  box-sizing: border-box;

  font-size: 1rem;
  font-weight: 700;

  border-radius: 999px;
}

.spotify {
  font-family: Spotify-Font, var(--safeFonts);

  background-color: var(--spotify-green);
}

footer {
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  background-color: var(--color-background-mute);
}

footer a {
  font-family: var(--safeFonts);
  font-size: 1rem;
  font-weight: 700;
}

@media (min-width: 500px) {
  header {
    height: 100px;;
  }
}

</style>
