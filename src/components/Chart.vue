<template id="randomChart">
  <div class="random" v-on:mousemove="updateCoordinates">
    <TrendChart ref="trendchart" :datasets="datasets" :grid="grid" :labels="labels" :min="0" :interactive="true" @mouse-move="onMouseMove" class="random-chart"></TrendChart>
      <div id="pop" role="tooltip" class="tooltip" ref="tooltip" :class="{'is-active': tooltipData}">
        <div class="tooltip-container" v-if="tooltipData">
          <strong>{{labels.xLabels[tooltipData.index]}}</strong>
          <div class="tooltip-data">
            <div class="tooltip-data-item tooltip-data-item--1">{{tooltipData.data[0]}}</div>
            <div class="tooltip-data-item tooltip-data-item--2">{{tooltipData.data[1]}}</div>
            <div class="tooltip-data-item tooltip-data-item--3">{{tooltipData.data[2]}}</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
import TrendChart from "vue-trend-chart";
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
var PopperClass = Vue.extend(Popper);
export default {
  name: 'Chart',
  components: {
    TrendChart,
  },
  props: {
    msg: String
  },
  data() {
    return {
      datasets: [
        {
          data: [70, 100, 400, 180, 100, 300, 500],
          smooth: true,
          showPoints: true,
          fill: true,
          className: "curve1",
        },
        {
          data: [150, 300, 350, 100, 350, 100, 15],
          smooth: true,
          showPoints: true,
          className: "curve2",
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          showPoints: true,
          className: "curve3",
        }
      ],
      grid: {
        verticalLines: true,
        horizontalLines: true
      },
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabels: 5,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
      },
      tooltipData: null,
      popper: null,
      popperIsActive: false,
      offset: 0,
    };
  },
  methods: {
    initPopper() {
      const chart = document.querySelector(".random-chart");
      const ref = chart.querySelector(".active-line");
      const tooltip = this.$refs.tooltip;
      this.popper = new PopperClass(ref, tooltip, {
        placement: "right",
        modifiers: {
          offset: { offset: "0,10" },
          preventOverflow: {
            boundariesElement: chart
          }
        }
      });
      this.$nextTick(this.popper.updatePopper)
    },
    onMouseMove(params) {
      this.popperIsActive = !!params;
      // this.popper.scheduleUpdate();
      if (params) {
        const trendchart = this.$refs.trendchart;
        // this.x = trendchart.chartAxesXCoords[params.index];
        if (params.index < Math.round(trendchart.chartAxesXCoords.length/2)) {
          // this.offset = 10*2+(20+15+5)*3 + 10;
          this.offset = 10;
        } else {
          // this.offset = -(20)*3 - 10;
          this.offset = -(10*2+(20+15+5)*3 + 5) -(20)*3 ;
        }
      }
      this.tooltipData = params || null;
    },
    updateCoordinates(event) {
      this.y = event.clientY;
      this.x = event.clientX;
      const tooltip = this.$refs.tooltip;
      // const translateVal = `translate(${this.x + this.offset}px, ${this.y}px)`;
      const translateVal = `translate(${this.x + this.offset}px, ${this.y}px)`;
      tooltip.style.transform = translateVal;
      tooltip.style['-webkit-transform'] = translateVal;
      tooltip.style['-moz-transform'] = translateVal;
      tooltip.style['-ms-transform'] = translateVal;
    }
  },
  mounted() {
    this.initPopper();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
* {
  box-sizing: border-box;
}

strong {
  font-weight: 600;
}

body {
  padding: 0;
  margin: 0;
  font-family: "Source Sans Pro", sans-serif;
  color: #2f4053;
}

#app {
  margin: 0 auto;
  padding: 20px;
  max-width: 600px;
}

.curve1 {
  stroke: #fbac91;
  stroke-width: 2;
}

.random {
  width: 100%;
  .vtc {
    height: 250px;
    font-size: 12px;
    @media (min-width: 699px) {
      height: 320px;
    }
  }
  .labels {
    stroke: rgba(0, 0, 0, 0.05);
  }
  .active-line {
    stroke: rgba(0, 0, 0, 0.2);
    stroke-width: 2;
  }
  .point {
    stroke-width: 2;
    transition: stroke-width 0.2s;
  }
  .point.is-active {
    stroke-width: 5;
  }

  .curve1 {
    .stroke {
      stroke: #fbac91;
      stroke-width: 2;
    }
    .fill {
      fill: #fbac91;
      opacity: 0.05;
    }
    .point {
      fill: #fbac91;
      stroke: #fbac91;
    }
  }
  .curve2 {
    .stroke {
      stroke: #fbe1b6;
      stroke-width: 2;
    }
    .point {
      fill: #fbe1b6;
      stroke: #fbe1b6;
    }
  }
  .curve3 {
    .stroke {
      stroke: #7fdfd4;
      stroke-width: 2;
    }
    .point {
      fill: #7fdfd4;
      stroke: #7fdfd4;
    }
  }

  .tooltip {
    &:not(.is-active) {
      display: none;
    }
    position: absolute; 
    // will-change: transform; 
    top: 0px; left: 0px; 
    transform: translate(0px, 0px);
    -webkit-transform: translate(0px, 0px);
    -moz-transform: translate(0px, 0px);
    -ms-transform: translate(0px, 0px);
    -webkit-transition: 150ms ease-out;
    -moz-transition: 150ms ease-out;
    transition: 150ms ease-out;
    padding: 10px;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    &-data {
      display: flex;
      &-item {
        display: flex;
        align-items: center;
        &:not(:first-child) {
          margin-left: 20px;
        }
        &:before {
          content: "";
          display: block;
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }
        &--1:before {
          background: #fbac91;
        }
        &--2:before {
          background: #fbe1b6;
        }
        &--3:before {
          background: #7fdfd4;
        }
      }
    }
  }
}
 
</style>