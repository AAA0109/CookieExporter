<template>
  <div class="app">
    <h1 class="app__title">Cookie Manager</h1>

    <template v-if="domIsReady">
      <!-- <SearchTerm class="app__search-term" :tabId="tabId"/>
      <SetGoogleBackground :tabId="tabId"/> -->
      <div class="app__btns">
        <div class="app__btn" @click="exportCookie">Export</div>
        <div class="app__btn" @click="openModal">Import</div>
      </div>
      <div class="app__description">{{description}}</div>
      <input id="app__file_input" type="file" @change="changedFile"/>
    </template>

    <h2 v-else class="app__title"> Loading...</h2>
  </div>
</template>

<script>
import { domIsReady, getCookies, loadCookies, clearCookies, downloadJSON, getTabUrl } from './utils/chrome'

export default {
  data() {
    return {
      domIsReady: false,
      description: ''
    }
  },
  mounted() {
    this.awaitReady()
  },
  methods: {
    async awaitReady() {
      await domIsReady()
      this.domIsReady = true
    },
    async exportCookie() {
      try {
        const url = await getTabUrl();
        if(!url) return;
        let urls = [], cookieArr = [];
        urls.push(url);
        if (url.toLocaleLowerCase().includes('linkedin')) {
          urls.push('https://lnkd.demdex.net');
          urls.push('https://radar.cedexis.com');
        }
        for (let i = 0; i < urls.length; i ++) {
          const cookies = await getCookies(urls[i]);
          cookieArr.push(cookies);
        }
        await downloadJSON(JSON.stringify(cookieArr));
        this.description = 'Exported!!';
      } catch(ex) {
        console.log(ex);
        this.description = 'Failed Export!!';
      }
    },
    async importCookie(cookies) {
      try {
        const data = JSON.parse(cookies);
        await clearCookies(data);
        await loadCookies(data);
        this.description = 'Imported!!';
      } catch(ex) {
        console.log(ex);
        this.description = 'Failed Import!!';
      }
    },
    openModal() {
      document.getElementById('app__file_input').click();
    },
    changedFile(evt) {
      var f = evt.target.files[0];
      if(f) {
        var reader = new FileReader();
        reader.onload = async (e) => {
          var contents = e.target.result;
          await this.importCookie(contents);
        }
        reader.readAsText(f);
      }
    }
  },
}
</script>

<style lang="scss">
@import './scss/reset';

.app {
  height: 100px;
  width: 200px;
  padding: 10px;

  &__btns {
    display: flex;
    justify-content: space-between;
  }

  &__btn {
    color: white;
    background-color: rgb(71, 127, 248);
    padding: 6px 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.7;
    }
  }

  &__description {
    text-align: center;
    margin-top: 10px;
  }

  &__search-term {
    margin-bottom: 10px;
  }

  &__title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
    text-align: center;
  }
}
#app__file_input {
  display: none;
}
</style>