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
import { domIsReady, getTabId } from './utils/chrome'
import SearchTerm from './components/SearchTerm.vue'
import SetGoogleBackground from './components/SetGoogleBackground.vue'

import { generateMessage } from './utils/message'
import { sendMessage, downloadJSON } from './utils/chrome'
import { POPUP_SCRIPT_ID } from './constants/from.modules'
import { EXPORT_COOKIE, IMPORT_COOKIE } from './constants/actions'

export default {
  components: {
    SearchTerm,
    SetGoogleBackground,
  },
  data() {
    return {
      domIsReady: false,
      tabId: '',
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
      this.tabId = await getTabId()
    },
    async exportCookie() {
      const message = generateMessage(POPUP_SCRIPT_ID, EXPORT_COOKIE, {})
      const cookies = await sendMessage(this.tabId, message)
      console.log(cookies);
      await downloadJSON(cookies);
      this.description = 'Exported!!';
    },
    async importCookie(cookies) {
      const message = generateMessage(POPUP_SCRIPT_ID, IMPORT_COOKIE, { cookies })
      await sendMessage(this.tabId, message)
      this.description = 'Imported!!';
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