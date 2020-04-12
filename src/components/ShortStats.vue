<template>
  <div class="row">
   <div class="col-sm-6 col-lg-3">
      <div class="card bg-gradient-primary text-white">
         <div class="card-body pb-0 d-flex justify-content-between">
            <div>
               <div class="text-value-lg">{{ formatNumber(recovered) }}</div>
               <div>Recovered</div>
            </div>
         </div>
      </div>
   </div>
   <div class="col-sm-6 col-lg-3">
      <div class="card bg-gradient-warning text-white">
         <div class="card-body pb-0 d-flex justify-content-between">
            <div>
               <div class="text-value-lg">{{ formatNumber(cases) }}</div>
               <div>Confirmed</div>
            </div>
         </div>
      </div>
   </div>
   <div class="col-sm-6 col-lg-3">
      <div class="card bg-gradient-danger text-white">
         <div class="card-body pb-0 d-flex justify-content-between">
            <div>
               <div class="text-value-lg">{{ formatNumber(deaths) }}</div>
               <div>Deaths</div>
            </div>
         </div>
      </div>
   </div>
</div>
</template>

<script>
export default {
  name: 'ShortStats',
  props: {
    cases: Number,
    deaths: Number,
    recovered: Number
  },
  methods: {
     formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row {
   /* width: 100%; */
   margin: 0 auto;
   padding: 30px;
   display: -webkit-box;
   display: -ms-flexbox;
   display: flex;
   -ms-flex-wrap: wrap;
   flex-wrap: wrap;
   flex-direction: row;
   /* margin-right: -15px;
   margin-left: -15px; */
   /* align-content: center; */
   /* justify-items: center; */
   justify-content: center;
}
.col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto {
    position: relative;
    width: 100%;
    /* padding-right: 15px; */
    /* padding-left: 15px; */
}

.text-white {
    color: #fff!important;
}
.bg-gradient-primary {
    background: #1f1498!important;
    background: linear-gradient(45deg, #2eb85ccc,#29904b)!important;
    border-color: #1f1498!important;
}
.bg-gradient-warning {
    background: #f6960b!important;
    background: linear-gradient(45deg,#f9b115cc,#f6960b)!important;
    border-color: #f6960b!important;
}
.bg-gradient-danger {
    background: #d93737!important;
    background: linear-gradient(45deg,#e55353cc,#d93737)!important;
    border-color: #d93737!important;
}
.card {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    margin-bottom: 1.5rem;
    word-wrap: break-word;
    background-clip: border-box;
    border-radius: .25rem;
    background-color: #fff;
    border-color: #d8dbe0;

    border: 0;
    box-shadow: 0 1px 1px 0 rgba(60,75,100,.14), 0 2px 1px -1px rgba(60,75,100,.12), 0 1px 3px 0 rgba(60,75,100,.2);
}

/* .justify-content-between {
    -webkit-box-pack: justify!important;
    -ms-flex-pack: justify!important;
    justify-content: space-between!important;
} */
.d-flex {
    display: -webkit-box!important;
    display: -ms-flexbox!important;
    display: flex!important;
}
.card-body {
   -webkit-box-flex: 1;
   -ms-flex: 1 1 auto;
   flex: 1 1 auto;
   min-height: 1px;
   padding: 1rem;
   justify-content: center;
   align-content: center;
   align-items: center;
   justify-items: center;
}
.text-white {
    color: #fff!important;
}
.text-value-lg {
    font-size: 1.3125rem;
}
[class^=text-value] {
    font-weight: 600;
}


@media (min-width: 576px) {
  .col-sm-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%;
  }
  .card-body {
     padding: 1.25rem;
  }
}
/* 992 */
@media (min-width: 800px){
  .col-lg-3 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 31%;
    flex: 0 0 31%;
    max-width: 31%;
  }
  .card-body {
     padding: 2.25rem;
  }
  .row {
   justify-content: space-between;
  }
}
@media (min-width: 1000px){
  .col-lg-3 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 31%;
    flex: 0 0 31%;
    max-width: 31%;
  }
  .card-body {
     padding: 2.5rem;
  }
}
</style>
