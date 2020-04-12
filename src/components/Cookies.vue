<template>
  <div v-show="!userAccepted" class="c-footer">
    <div class="description">
      <span>This website uses cookies to ensure you get the best experience on our website.</span>
      <div id="ok-button" @click="onOkButtonClick">Got it!</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cookies',
  data() {
    return {
      userAccepted: false,
    }
  },
  methods: {
    onOkButtonClick() {
      this.userAccepted = true;
    }
  }
}
</script>

<style>
.c-footer {
  position: fixed;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: #fff;
  z-index: 1030;
  justify-content: center;
  align-content: center;
  align-items: center;
  justify-items: center;
}
.description {
  color: #636f83!important;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  justify-items: center;
}
#ok-button {
  padding: 6px 10px;
  margin: 0 10px;
  background-color: #636f83;
  color: #fff;
  cursor: pointer;
  min-width: 40px;
}

@media (max-width: 800px){
  .c-footer {
    font-size: 10pt;
  }
}
</style>
