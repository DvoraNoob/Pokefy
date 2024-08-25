<template>
    <div class="card_border" :style="cardStyle">
      <div :class="['card', getHolographicClass(genre)]">
        <div class="header_container">
          <div class="genre_container">
            {{ cleanGenre(genre) }}
          </div>
          <p class="artist_name header_item" :style="{ color: getTextColor(genre) }">
            {{ getArtistName(artistName, genre) }}
          </p>
          <p class="hp header_item" :style="{ color: getTextColor(genre) }">HP</p>
          <p class="hp_value header_item" :style="{ color: getTextColor(genre) }">170</p>
          <img class="type header_item" :src="getType(genre)" />
        </div>
        <div class="artist_container">
          <img class="artist" :src="imageUrl" />
          <p id="artist_description"></p>
        </div>
        <div v-for="(albumItem, index) in getAlbums(albums, genre)" :key="index">
          <div class="ability">
            <img class="ability_type" :src="getType(genre)" style="left: 20px" />
            <img class="ability_type" :src="getType(genre)" style="left: 48px" />
            <p class="title" :style="{ color: getTextColor(genre) }">{{ albumItem.album.name }}</p>
            <p class="power" :style="{ color: getTextColor(genre) }">{{ albumItem.power }}</p>
            <p class="description" :style="{ color: getTextColor(genre) }">{{ formatTracks(albumItem.tracks) }}</p>
          </div>
        </div>
        <div id="bottom_container">
          <div class="favorite_track" :style="{ color: getTextColor(genre) }">{{ favoriteTrack }}</div>
          <div id="line_seperator" />
          <div id="bottom_stats">
            <div class="bottom_item popularity">
              <p class="title bottom_title">Popularity</p>
              <p class="description bottom_sub">{{ popularity }} / 100</p>
            </div>
            <div class="bottom_item followers">
              <p class="title bottom_title">Followers</p>
              <p class="description bottom_sub">{{ numberWithCommas(followers) }}</p>
            </div>
            <div class="resistance_container">
              <div v-for="(item, index) in getResistance(popularity)" :key="index">
                <img class="resistance" :src="item.src" :style="{ left: item.left }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import fire from '../assets/elemental-icons/fire.png';
  import resistance from '../assets/elemental-icons/resistance.png';
  import normal from '../assets/elemental-icons/normal.png';
  import metal from '../assets/elemental-icons/metal.png';
  import psychic from '../assets/elemental-icons/psychic.png';
  import electric from '../assets/elemental-icons/electric.png';
  import ghost from '../assets/elemental-icons/ghost.png';
  import grass from '../assets/elemental-icons/grass.png';
  import fighting from '../assets/elemental-icons/fighting.png';
  import water from '../assets/elemental-icons/water.png';
  
  export default {
    name: 'Card',
    props: {
      genre: String,
      artistName: String,
      imageUrl: String,
      popularity: Number,
      followers: Number,
      albums: Array,
      cardStyle: Object,
      favoriteTrack: String,
    },
    data() {
      return {
        ALBUM_FILTER: ['canadian', 'chicago', 'atl', 'dfw', 'east coast', 'west coast', 'boston', 'florida', 'miami', 'contemporary', 'modern', 'la', 'albany', 'ny'],
      };
    },
    methods: {
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      getResistance(popularity) {
        let num = 0;
        if (popularity >= 75) {
          num = 3;
        } else if (popularity >= 50) {
          num = 2;
        } else if (popularity >= 25) {
          num = 1;
        }
  
        const items = [];
        let left = 20; // TODO so much hardcoded stuff
        for (let i = 0; i < num; i++) {
          items.push(`<img class="resistance" src="${resistance}" style="left:${left}px"/>`);
          left += 25;
        }
        return items.join('');
      },
      getType(genre) {
        if (genre) {
          if (genre.includes('emo') || genre.includes('punk')) {
            return ghost;
          } else if (genre.includes('hip') || genre.includes('rap') || genre.includes('grime') || genre.includes('hard') || genre.includes('metal')) {
            return metal;
          } else if (genre.includes('edm') || genre.includes('electro') || genre.includes('dubstep') || genre.includes('brostep') || genre.includes('latin')) {
            return electric;
          } else if (genre.includes('pop')) {
            return psychic;
          } else if (genre.includes('r&b')) {
            return fire;
          } else if (genre.includes('indie')) {
            return water;
          } else if (genre.includes('country') || genre.includes('folk')) {
            return grass;
          } else if (genre.includes('rock')) {
            return fighting;
          }
        }
        return normal;
      },
      getHolographicClass(genre) {
        if (genre) {
          if (genre.includes('emo') || genre.includes('punk')) {
            return 'holographic_emo';
          } else if (genre.includes('hip') || genre.includes('rap') || genre.includes('grime') || genre.includes('hard') || genre.includes('metal')) {
            return 'holographic_hip_hop';
          } else if (genre.includes('edm') || genre.includes('electro') || genre.includes('dubstep') || genre.includes('brostep') || genre.includes('latin')) {
            return 'holographic_electro';
          } else if (genre.includes('pop')) {
            return 'holographic_pop';
          } else if (genre.includes('r&b')) {
            return 'holographic_rb';
          } else if (genre.includes('indie')) {
            return 'holographic_indie';
          } else if (genre.includes('country') || genre.includes('folk')) {
            return 'holographic_country';
          } else if (genre.includes('rock')) {
            return 'holographic_rock';
          }
        }
        return 'holographic_pop';
      },
      getTextColor(genre) {
        if (genre) {
          if (genre.includes('indie')) {
            return '#000000';
          }
          if (
            genre.includes('hip') ||
            genre.includes('rap') ||
            genre.includes('grime') ||
            genre.includes('hard') ||
            genre.includes('metal') ||
            genre.includes('rock') ||
            genre.includes('emo') ||
            genre.includes('punk')
          ) {
            return '#FFFFFF';
          }
        }
        return '#000000';
      },
      getArtistName(artistName, genre) {
        let total_length = parseInt(1.2 * artistName.length) + this.cleanGenre(genre).length;
        if (total_length > 35) {
          return artistName.substring(0, parseInt((35 - this.cleanGenre(genre).length) / 1.2) - 1) + "...";
        } else {
          return artistName;
        }
      },
      removeParentheses(string) {
        return string.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^)]*\] */g, '');
      },
      formatTracks(tracks) {
        let cleaned = tracks.map(track => this.removeParentheses(track)).join(', ');
        if (cleaned.length > 100) {
          return cleaned.substring(0, 97) + "...";
        } else {
          return cleaned;
        }
      },
      cleanGenre(genre) {
        if (genre) {
          let cleaned = genre;
          this.ALBUM_FILTER.forEach((country) => {
            cleaned = cleaned.replace(country + ' ', '');
          });
          return cleaned;
        }
        return "";
      },
      getAlbums(albums, genre) {
        const albumsRows = [];
        let image = this.getType(genre);
        const powers = [100, 80, 60, 120, 90];
        albums.forEach(albumItem => {
          let album = albumItem.album;
          if (albumsRows.length < 2) {
            let power = powers[Math.floor(Math.random() * powers.length)];
            albumsRows.push(
              `<div class="ability">
                <img class="ability_type" src="${image}" style="left:20px"/>
                <img class="ability_type" src="${image}" style="left:48px"/>
                <p class="title" style="color:${this.getTextColor(genre)}">${album.name}</p>
                <p class="power" style="color:${this.getTextColor(genre)}">${power}</p>
                <p class="description" style="color:${this.getTextColor(genre)}">${this.formatTracks(albumItem.tracks)}</p>
              </div>`
            );
            image = normal;
          }
        });
        return albumsRows.join('');
      }
    }
  };
  </script>

  <style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');
  .card_border {
    width: 500px;
    height: 698px;
    background: #fbdd65;
    border-radius: 15px;
    position: relative;
    margin:auto
  }
  .card {
    width: 460px;
    height: 658px;
    margin-top: 21px;
    margin-left: 21px;
    display: inline-block;
    background: #f5b413;
    border-radius: 10px;
    position: relative;
  }
  
  
  .artist_container{
    width: 400px;
    height: 275px;
    margin-left: 25px;
    display: inline-block;
  }
  
  .artist {
    border: 5px solid #cbc7c3;
    border-radius: 1px;
    object-fit: cover;
  }
  .header_item {
    padding: 0px;
    margin-top:0px;
    top: 10px;
    position: relative;
    margin-bottom: 0px;
    display: inline-block;
  }
  
  .artist {
    width: 100%;
    height: 100%;
  }
  
  .artist_name {
    margin-left: 10px;
    font-size: 1.6em;
    font-weight: 700;
    font-family: 'Roboto Condensed';
  }
  
  .header_container {
    margin-top: 0px;
    margin-bottom: 10px;
    position: relative;
  }
  
  .hp {
    font-weight: 700;
    font-family: 'Roboto Condensed';
    position: absolute;
    right: 90px;
    top: 20px;
    font-size: .95em;
  }
  
  .hp_value {
    font-weight: 700;
    font-family: 'Roboto Condensed';
    font-size: 1.6em;
    right: 50px;
    position: absolute;
  }

  .holographic_rb {
    background-image: radial-gradient( 
        circle farthest-corner at 10% 20%,  
        rgba(62,133,238,1) 1.1%,
         rgba(227,137,240,1) 43.7%, 
         rgba(243,193,124,1) 89.7% );
    background-size: 200%;
  }
  
  .holographic_pop {
    background-image: linear-gradient(
        to right,
        rgb(194, 255, 182),
        rgb(255, 163, 182),
        rgb(221, 169, 255),
        rgb(162, 209, 255)
    ); 
    background-size: 200%;
  }

  .holographic_rock {
    background-image: linear-gradient( 181.3deg,  rgba(134,15,15,1) 24.9%, rgba(183,10,10,1) 46.9%, rgba(210,70,0,1) 85.1% );
  }

  .holographic_indie {
    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(130,205,221,1) 0%, rgba(255,247,153,1) 90% );
    background-size: 200%
  }

  .holographic_country {
    background-image: radial-gradient( circle 880px at -0.7% 57.1%,  rgba(202,149,149,1) 0%, rgba(239,215,177,1) 14.3%, rgba(239,239,177,1) 27.4%, rgba(191,239,177,1) 40.1%, rgba(177,239,217,1) 48.7%, rgba(177,238,239,1) 56.7%, rgba(177,180,239,1) 73.2%, rgba(224,177,239,1) 89.8%, rgba(239,177,231,1) 100.2% );
    background-size:200%
  }

  .holographic_hip_hop {
    background-image: linear-gradient(
        to right,
        rgb(0, 0, 0),
        rgb(90, 90, 90),
        rgb(166, 166, 166),
        rgb(80, 80, 80) 
    ); 
    background-size: 200%;
  }

  .holographic_emo {
    background-image: linear-gradient( 112.1deg,  rgba(32,38,57,1) 11.4%, rgba(63,76,119,1) 70.2% );
  }

  .holographic_electro {
    background-image: radial-gradient( 
        circle farthest-corner at 10% 20%, 
         rgba(255,37,174,1) 0%, 
         rgba(241,147,55,1) 53.4%,
        rgba(250,237,56,1) 99.5% );
        background-size: 200%;
  }
  .type {
    width: 30px;
    position: absolute;
    top: 10px;
    right:10px;
    font-family: 'Roboto Condensed';
    font-style: italic;
  }
  
  .genre_container {
    background-color: #dedede;
    display: inline-block;
    min-width: 60px;
    height: 30px;
    top: 5px;
    position: relative;
    line-height: 30px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
    font-family: 'Orbitron';
    font-style: italic;
    color:grey;
    border-radius: 0px 10px 0px 0px;
  }
  
  #artist_description {
    font-family: 'Roboto Condensed';
    font-size: 1.1em;
    margin-top: 5px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }
  
  .ability {
   text-align: center;
   position: relative;
  }
  
  .title {
    font-family: 'Roboto Condensed';
    font-weight: 700;
    font-size: 1.25em;
    display: inline-block;
    margin-bottom: 0px;
  }
  
  .power {
    position: absolute;
    font-size: 1.25em;
    font-family: 'Roboto Condensed';
    font-weight: 700;
    top: 0px;
    right: 50px;
    margin-bottom: 0px;
  }
  
  .ability_type {
    position: absolute;
    top: 15px;
    margin-bottom: 0px;
    width: 28px;
  }
  
  .description {
    margin-left: 25px;
    margin-right: 25px;
    font-weight: 700;
    font-family: 'Roboto Condensed';
  }
  
  #bottom_stats {
    position: relative;
  }
  
  #line_seperator {
    border-bottom: 1px solid black;
    margin-left: 25px;
    margin-right: 25px;
    margin-top: 5px;
  }
  
  .bottom_title { 
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 1.1;
    font-size: 1.1em;
  }
  
  .bottom_sub {
    display: inline-block;
    font-size: 1.05em;
    margin-left: 5px;
    margin-right: 10px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  
  .bottom_item {
    background-color: #dedede;
    display: inline-block;
    padding: 0px;
    border-radius: 5px 0px;
    border: 1px solid #a6a6a6;
    margin-top: 7px;
  }
  
  .popularity {
    position: absolute;
    left: 20px;
  }
  
  .followers {
    position: absolute;
    right: 20px;
  }
  
  .resistance {
    display: inline-block;
    width: 25px;
  }
  .resistance_container{
    position: absolute;
    bottom: 0px;
    left: 25px;
    top: 43px;
    display: inline-block;
  }
  
  #bottom_container {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 100px;
      margin-top: 0px;
  }

  .favorite_track {
      margin-top: 0;
      margin-bottom: 0;
      padding-top: 0;
      padding-bottom: 0;
      margin-left: 25px;
  }

  .favorite_track {
    font-weight: 700;
    font-family: 'Roboto Condensed';
    font-style: italic;
  }
  </style>