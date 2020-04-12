<template>
  <header class="c-header">
    <div class="title-value">
      {{title}}
    </div>
  </header>
</template>

<script>

export default {
  name: 'Header',
  props: {
    title: String
  }
}
</script>

<style>
.c-header {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 56px;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgba(60,75,100,.14), 0 3px 1px -2px rgba(60,75,100,.12), 0 1px 5px 0 rgba(60,75,100,.2);
  z-index: 1030;
  border-bottom: 1px solid #d8dbe0;
  justify-content: center;
  align-content: center;
  align-items: center;
  justify-items: center;
}
.title-value {
  color: #636f83!important;
  font-size: 1.05rem;
  font-weight: 600;
}
@media (min-width: 800px){
  .title-value {
    font-size: 1.5rem;
    font-weight: 900;
  }
  .c-header {
    height: 70px;
  }
}
</style>
