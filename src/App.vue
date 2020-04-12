<template>
  <div id="app">
    <Header title="Compare COVID19 infection rate across different regions" ref="header"/>
    <div class="container">
      <sidebar-menu 
        :menu="menu" 
        theme="white-theme"
        :style="menuStyle"
        width="200px"
        :hideToggle="!isMenuCollapsed"
        :collapsed="isMenuCollapsed"
        class="countries-menu"
        @item-click="onCountryClick"
      >
        <span slot="toggle-icon">
          <img id="menu-icon" src="./assets/baseline_menu_open_black_18dp.png" />
        </span>
      </sidebar-menu>
      <div class="content" :style="contentStyle" ref="content">
        <ShortStats :cases="getCases" :deaths="getDeaths" :recovered="getRecovered" />
        <div id="selection-info">
          <span class="text">
            Compare <b>{{ countriesData && selectedCountryCode ? countriesData[selectedCountryCode].name : '' }}</b> to 
          </span>
          <div id="model-select-wrapper">
            <model-select 
              :options="modelSelectOptions"
              v-model="selectedCountryCode2"
              placeholder="country"
            />
          </div>
        </div>
        <div id="selection-info">
          <span class="text">Begin chart from</span>
          <div id="model-select-wrapper">
            <model-select 
              :options="casesSelectOptions"
              v-model="startChartFromAmount"
              :placeholder="startChartFromAmount.toString()"
            />
          </div>
          <span class="text">cases</span>
        </div>
        <div id="chart-wrapper">
          <line-chart v-if="countriesData !== null" :chart-data="getDatasetCollection" :options="chartOptions"></line-chart>
        </div>
        <span>
          Data source: <a href="https://github.com/CSSEGISandData/COVID-19">data repository</a> for the 2019 Novel Coronavirus Visual Dashboard operated by the Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE). Also, Supported by ESRI Living Atlas Team and the Johns Hopkins University Applied Physics Lab (JHU APL).
        </span>
      </div>
    </div>
    <cookies />
  </div>
</template>

<script>
import { ModelSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import vFlagIcons from 'v-flag-icons'
import 'v-flag-icons/css/rectangular.min.css'

import ShortStats from './components/ShortStats.vue'
import Header from './components/Header.vue'
import LineChart from './components/LineChart.js'
import Cookies from './components/Cookies.vue'

const historical = require('./utils/historical.js');

export default {
  name: 'App',
  components: {
    ShortStats,
    Header,
    ModelSelect,
    SidebarMenu,
    // eslint-disable-next-line vue/no-unused-components
    vFlagIcons,
    LineChart,
    Cookies,
  },
  data () {
    return {
      windowWidth: window.innerWidth,
      menuHeight: 0,
      modelSelectOptions: [],
      casesSelectOptions: [0, 100, 1000, 2000, 5000, 10000].map(x => {return {value: x, text: x}}),
      countriesData: null,
      menu: [],
      selectedCountryCode: null,
      selectedCountryCode2: null,
      datacollection: { },
      chartOptions: {
        maintainAspectRatio: false
      },
      startChartFromAmount: 0,
    }
  },
  methods: {
    onCountryClick(event, item) {
      this.selectedCountryCode = item.code;
    },
    calculateMenuHeight() {
      if (this.$refs.header && this.$refs.content) {
        this.menuHeight = Math.max(this.$refs.content.clientHeight, window.innerHeight - this.$refs.header.$el.clientHeight);
      }
    },
    getLastTimelineValue(type) {
      try {
        return this.countriesData[this.selectedCountryCode].timeline[type][this.countriesData[this.selectedCountryCode].lastDate]
      } catch {
        return 0;
      }
    },
    autoSelectCountryByIP() {
      fetch('http://ip-api.com/json')
        .then(d => d.json())
        .then((data) => {
          this.selectedCountryCode = data.countryCode;
        });
    },
    mapCountryDataForMenu(countriesDataList) {
      return countriesDataList.map(c => {
        const icon = c.code.length === 2 ?  {
              element: 'vf-icon',
              class: 'ctr',
              attributes: {country: c.code}
            } : null;
        return {
            title: c.name,
            code: c.code,
            icon,
          }
        });
    },
    mapCountriesDataForModelSelect(countriesDataList) {
      return countriesDataList.map(c => {
        return {
            value: c.code,
            text: c.name,
          }
        });
    },
    createChartDataset(countryCode, color, filterUntil = null) {
      if (this.countriesData && countryCode) {
        let data = Object.values(this.countriesData[countryCode].timeline.cases);
        if (filterUntil !== null) {
          data = data.filter(val => val >= filterUntil);
        }
        return {
          label: this.countriesData[countryCode].name,
          borderColor: color,
          fill: false,
          data
        }
      }
      return null;
    },
  },
  mounted() {
    window.addEventListener('resize', () => { 
      this.windowWidth = window.innerWidth;
      this.calculateMenuHeight();
    });
    this.autoSelectCountryByIP();
    

    historical.historical().then(data => {
      this.countriesData = data;
      let countriesDataList = Object.values(data);
      countriesDataList.sort((c1, c2) =>  c2.timeline.cases[c2.lastDate] - c1.timeline.cases[c1.lastDate]);
      this.menu = this.mapCountryDataForMenu(countriesDataList);
      this.modelSelectOptions = this.mapCountriesDataForModelSelect(countriesDataList);
    })
  },
  updated() {
    this.$nextTick(() => this.calculateMenuHeight())
  },
  computed: {
    getDatasetCollection() {
      const datasets = [];
      if (this.selectedCountryCode) {
        datasets.push(this.createChartDataset(this.selectedCountryCode, '#39f', this.startChartFromAmount))
      }
      if (this.selectedCountryCode2) {
        datasets.push(this.createChartDataset(this.selectedCountryCode2, '#636f83', this.startChartFromAmount))
      }
      let labels = []
      if (this.startChartFromAmount && this.startChartFromAmount !== 0) {
        const labelsLength = Math.max(...datasets.map(ds => ds.data.length))
        labels = [...Array(labelsLength).keys()].map((_, i) => `day ${i+1}`);
      } else {
        labels = Object.keys(this.countriesData[this.selectedCountryCode].timeline.cases);
      }
      return {
        labels,
        datasets
      };
    },
    isMenuCollapsed() {
      return this.windowWidth < 700;
    },
    contentStyle() {
      return {
        '--width': `${this.isMenuCollapsed ? this.windowWidth - 50 : this.windowWidth -200}px`,
      }
    },
    menuStyle() {
      return {
        '--height': `${this.menuHeight}px`
      }
    },
    getCases() {
      return this.getLastTimelineValue('cases');
    },
    getDeaths() {
      return this.getLastTimelineValue('deaths');
    },
    getRecovered() {
      return this.getLastTimelineValue('recovered');
    }
  }
}
</script>

<style>
body {
  width: 100%;
  padding: 0;
  margin: 0;
  font-family: "Source Sans Pro", sans-serif;
  color: #2f4053;
  background-color: #ebedef;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  overflow: hidden;
  /* margin-top: 70px; */
}
.container {
  display: flex;
  flex-direction: row;
}
.content {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* width: calc(100% - var(--menu-width)); */
  width: var(--width);
  height: auto;
}

.countries-menu  {
  position: relative;
  /* height: calc(100vh - 70px); */
  height: var(--height);
}

.countries-menu span {
  width: inherit;
  /* text-transform: capitalize; */
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;
}
.v-sidebar-menu .vsm--toggle-btn {
  border-width: 0px;
}

#menu-icon {
  height: 20px;
  width: 20px;
}

#selection-info {
  display: flex;
  flex-direction: row;
  padding: 0 30px 0 30px;
  width: calc(100% - 60px);
  justify-content: start;
  align-items: center;
}
.search, .text {
  font-size: 20pt !important;
  line-height: 20pt  !important;
  text-overflow: ellipsis;
}
.search {
  margin-right: 0 !important;
  padding-right: 0 !important;
}
#model-select-wrapper {
  display: inline-block;
  width: 300px;
  margin: 20px;
}

.ctr {
  background-color: transparent !important;
}

#chart-wrapper {
  padding: 30px 0 30px 0;
  width: calc(100% - 60px);
}
#line-chart {
  background-color: white;
  margin: 0 30px 0px 30px;
  border-radius: .25rem;
  border: 0;
  box-shadow: 0 1px 1px 0 rgba(60,75,100,.14), 0 2px 1px -1px rgba(60,75,100,.12), 0 1px 3px 0 rgba(60,75,100,.2);
}

@media (max-width: 800px){
  #selection-info {
    flex-direction: column;
  }
  .search, .text {
    font-size: 16pt !important;
    line-height: 16pt !important;
  }
  #model-select-wrapper {
    display: inline-block;
    width: 160px;
  }
}
</style>
