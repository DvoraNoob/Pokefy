<template>
  <div>
    <div class="results">
      <div class="time_container">
        <div class="btn" @click="updateState('short_term', bearer)">Last Month</div>
        <div class="btn" @click="updateState('medium_term', bearer)">Last 6 Months</div>
        <div class="btn" @click="updateState('long_term', bearer)">All Time</div>
      </div>
      <h1 v-if="firstArtistInfo">{{ firstArtistInfo.name }}, I choose you!</h1>
      <h3>Your top 3 artists {{ getTimeRangeString(timeRange) }}.</h3>
    </div>
    <div class="scale_container" :style="{ height: parseInt(scale * 765) + 'px' }">
      <div id="deck_container" :style="{ transform: 'scale(' + scale + ')' }">
        <Card
          v-if="thirdArtistInfo && thirdArtistAlbums && thirdArtistTopTrack !== undefined"
          :genre="thirdArtistInfo.genre"
          :artistName="thirdArtistInfo.name"
          :imageUrl="thirdArtistInfo.imageUrl"
          :popularity="thirdArtistInfo.popularity"
          :followers="thirdArtistInfo.followers"
          :albums="thirdArtistAlbums"
          :favoriteTrack="thirdArtistTopTrack"
          :cardStyle="{ left: '375px', zIndex: 1, top: '50px', transform: 'rotate(30deg)' }"
        />
        <Card
          v-if="secondArtistInfo && secondArtistAlbums && secondArtistTopTrack !== undefined"
          :genre="secondArtistInfo.genre"
          :artistName="secondArtistInfo.name"
          :imageUrl="secondArtistInfo.imageUrl"
          :popularity="secondArtistInfo.popularity"
          :followers="secondArtistInfo.followers"
          :albums="secondArtistAlbums"
          :favoriteTrack="secondArtistTopTrack"
          :cardStyle="{ left: '-375px', marginTop: '-648px', zIndex: 1, transform: 'rotate(-30deg)' }"
        />
        <Card
          v-if="firstArtistInfo && firstArtistAlbums && firstArtistTopTrack !== undefined"
          :genre="firstArtistInfo.genre"
          :artistName="firstArtistInfo.name"
          :imageUrl="firstArtistInfo.imageUrl"
          :popularity="firstArtistInfo.popularity"
          :followers="firstArtistInfo.followers"
          :albums="firstArtistAlbums"
          :favoriteTrack="firstArtistTopTrack"
          :cardStyle="{ left: '0px', marginTop: '-760px', zIndex: 2 }"
        />
      </div>
      <div class="results created_with">
        <h4 style="margin-top: 10px;">Created with mattognibene.github.io/pokeplaylistv3</h4>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import Card from '../components/Card.vue';
  import NetworkModule from './../SpotifyNetwork.js';
  
  export default {
    components: { Card },
    props: {
      bearer: String
    },
    data() {
      return {
        scale: Math.min(1, window.innerWidth / 1600),
        timeRange: 'medium_term',
        firstArtistInfo: null,
        secondArtistInfo: null,
        thirdArtistInfo: null,
        firstArtistAlbums: null,
        secondArtistAlbums: null,
        thirdArtistAlbums: null,
        firstArtistTopTrack: null,
        secondArtistTopTrack: null,
        thirdArtistTopTrack: null,
      };
    },
    methods: {
      async updateState(timeRange) {
        console.log("Atualizando estado com timeRange:", timeRange);

        const topTracks = await this.getTopTracks();
        console.log("Top Tracks:", topTracks);

        const artistIds = await this.getTopArtists(timeRange);
        console.log("Artist IDs:", artistIds);

        this.timeRange = timeRange;
  
        if (artistIds[0]) {
          const data = await this.getArtistInfo(artistIds[0]);
          console.log("First Artist Info:", data);

          this.firstArtistInfo = data;
          this.firstArtistTopTrack = this.getFavoriteTrack(data.id, topTracks);
          this.firstArtistAlbums = await this.getArtistAlbums(artistIds[0]);
        }
  
        if (artistIds[1]) {
          const data = await this.getArtistInfo(artistIds[1]);
          console.log("Second Artist Info:", data);

          this.secondArtistInfo = data;
          this.secondArtistTopTrack = this.getFavoriteTrack(data.id, topTracks);
          this.secondArtistAlbums = await this.getArtistAlbums(artistIds[1]);
        }
  
        if (artistIds[2]) {
          const data = await this.getArtistInfo(artistIds[2]);
          console.log("Third Artist Info:", data);

          this.thirdArtistInfo = data;
          this.thirdArtistTopTrack = this.getFavoriteTrack(data.id, topTracks);
          this.thirdArtistAlbums = await this.getArtistAlbums(artistIds[2]);
        }
      },
      cleanAlbumName(albumName) {
        let cleanName = this.removeParentheses(albumName);
        return cleanName.length > 33 ? cleanName.substring(0, 30) + "..." : cleanName;
      },
      async getTopArtists(timeRange) {
        const data = await NetworkModule.getData(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`, this.bearer);
        return data.items.slice(0, 3).map(item => item.id);
      },
      async getArtistInfo(artistId) {
        const data = await NetworkModule.getData(`https://api.spotify.com/v1/artists/${artistId}`, this.bearer);
        return {
          genre: data.genres[0],
          name: data.name,
          imageUrl: data.images[0].url,
          popularity: data.popularity,
          followers: data.followers.total,
          id: data.id
        };
      },
      async getTopTracks() {
        const data = await NetworkModule.getData(`https://api.spotify.com/v1/me/top/tracks?time_range=${this.timeRange}`, this.bearer);
        return data.items;
      },
      async getArtistAlbums(artistId) {
        const data = await NetworkModule.getData(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`, this.bearer);
        const albums = [];
        const seen = new Set();
  
        data.items.forEach(album => {
          if (album.album_type === "album" && albums.length < 2 && !album.name.toLowerCase().includes('live')) {
            const cleanName = this.cleanAlbumName(album.name);
            if (!seen.has(cleanName)) {
              albums.push({ name: cleanName, spotifyId: album.id });
              seen.add(cleanName);
            }
          }
        });
  
        const tracksPromises = albums.map(async album => {
          const data = await NetworkModule.getData(`https://api.spotify.com/v1/albums/${album.spotifyId}/tracks`, this.bearer);
          return data.items.slice(0, 6).map(track => track.name);
        });
  
        const tracks = await Promise.all(tracksPromises);
        return albums.map((album, i) => ({ album, tracks: tracks[i] }));
      },
      removeParentheses(string) {
        return string.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, "");
      },
      getTimeRangeString(timeRange) {
        switch (timeRange) {
          case "short_term": return "over the last month";
          case "medium_term": return "over the last six months";
          default: return "of all time";
        }
      },
      getFavoriteTrack(artistId, favoriteTracks) {
        let favTrack = "";
        if (artistId && favoriteTracks) {
          favoriteTracks.forEach(track => {
            track.artists.forEach(artist => {
              if (artist.id === artistId && !favTrack) {
                favTrack = `Your favorite track: ${track.name}`;
              }
            });
          });
        }
        return favTrack.length > 59 ? `${favTrack.substring(0, 55)}...` : favTrack;
      }
    },
    mounted() {
      this.updateState('medium_term');
    }
  };
  </script>
  
<style scoped>
@import url('../assets/fonts.css');

#deck_container {
    position: relative;
}

@media (max-width: 1500px) {
    #deck_container {
        position: relative;
        margin-top: -10vh;
    }
}

@media (max-width: 1300px) {
    #deck_container {
        position: relative;
        margin-top: -20vh;
    }
    .created_with {
        margin-top: -5vh;
        position: relative;
    }
}

@media (max-width: 1000px) {
    #deck_container {
        position: relative;
        margin-top: -20vh;
    }
    .created_with {
        margin-top: -10vh;
        position: relative;
    }
}

@media (max-width: 800px) {
    #deck_container {
        position: relative;
        margin-top: -25vh;
    }
    
    .created_with {
        margin-top: -15vh;
        position: relative;
        font-size: .75em;
    }
}

@media (max-width: 600px) {
    #deck_container {
        position: relative;
        margin-top: -30vh;
    }
    .created_with {
        margin-top: -20vh;
        position: relative;
        font-size: .75em;
    }
}

@media (max-width: 450px) {
    #deck_container {
        position: relative;
        margin-top: -40vh;
        margin-left: -5vw;
    }
    .created_with {
        margin-top: -25vh;
        position: relative;
        font-size: .75em;
    }
}

@media (max-width: 370px) {
    #deck_container {
        position: relative;
        margin-top: -50vh;
        margin-left: -5vw;
    }
    .created_with {
        margin-top: -30vh;
        position: relative;
        font-size: .75em;
    }
}


.artist_card {
    position: absolute;
    right: 0px;
}

.results {
    text-align: center;
    font-family: 'PokemonFont_Solid';
}

.time_container {
    margin-top: 5vh;
}

.scale_container {
    margin-top: 100px;
    position: relative;
    z-index: 0;
}
 
</style>
  