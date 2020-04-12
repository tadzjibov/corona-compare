// const axios = require("axios");
const csv = require("csvtojson");
const countryMap = require('./countryMap');
const countryUtils = require('./countryUtils');

var base =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";

var historical = async () => {
  let casesResponse, deathsResponse, recResponse;
  try {
    casesResponse = await fetch(
      // `${base}time_series_19-covid-Confirmed.csv`
      `${base}time_series_covid19_confirmed_global.csv`
    );
    deathsResponse = await fetch(`${base}time_series_covid19_deaths_global.csv`);
    recResponse = await fetch(`${base}time_series_covid19_recovered_global.csv`);
  } catch (err) {
    console.log(err);
    return null;
  }

  const parsedCases = await csv({
    noheader: true,
    output: "csv"
  }).fromString(await casesResponse.text());


  const parsedDeaths = await csv({
    noheader: true,
    output: "csv"
  }).fromString(await deathsResponse.text());

  const recParsed = await csv({
    noheader: true,
    output: "csv"
  }).fromString(await recResponse.text());

  // to store parsed data
  const result = [];
  const resultObj = {};
  const timelineKey = parsedCases[0].splice(4);
  const lastDate = timelineKey[timelineKey.length - 1];
  // parsedCases.pop()
  // parsedDeaths.pop()
  // recParsed.pop()

  for (let b = 1; b < parsedDeaths.length; ) {
    const timeline = {
      cases: {},
      deaths: {},
      recovered: {}
    };
    const c = parsedCases[b].splice(4);
    const r = recParsed[b]?.splice(4);
    const d = parsedDeaths[b].splice(4);
    for (let i = 0; i < c.length; i++) {
      timeline.cases[timelineKey[i]] = parseInt(c[i]);
      timeline.deaths[timelineKey[i]] = parseInt(d[i]);
      timeline.recovered[timelineKey[i]] = r ? parseInt(r[i]) : 0;
    }
    let countryName = parsedCases[b][1];
    let countryNameForCode = countryMap.standardizeCountryName(parsedCases[b][1].toLowerCase());
    let countryCode = countryUtils.getCountryCode(countryNameForCode);
    
    result.push({
      country: {
        name: countryName,
        code: countryCode,
      },
      province: parsedCases[b][0] === "" ? null : countryMap.standardizeCountryName(parsedCases[b][0].toLowerCase()),
      timeline
    });

    if (timeline.cases[lastDate] > 0) {
      if (resultObj[countryCode]) {
        const allDates = Object.keys(resultObj[countryCode].timeline.cases);
        for (let i = 0; i < allDates.length; i++) {
          const curDate = allDates[i];
          resultObj[countryCode].timeline.cases[curDate] += timeline.cases[curDate];
          resultObj[countryCode].timeline.deaths[curDate] += timeline.deaths[curDate];
          resultObj[countryCode].timeline.recovered[curDate] += timeline.recovered[curDate];
        }
      } else {
        resultObj[countryCode] = {
          name: countryName,
          code: countryCode,
          timeline,
          lastDate
        };
      }
    }
    b++;
  }

  // const removeFirstObj = result;//.splice(1);
  // // const string = JSON.stringify(removeFirstObj);
  // // const groupedByCountry = removeFirstObj.reduce((rv, x) => {
  // //   (rv[x.country.code] = rv[x.country.code] || []).push(x);
  // //   return rv;
  // // }, {});

  // // const totalCasesAU = resultObj['AU'].timeline.cases

  // console.log(removeFirstObj);
  // console.log("GROUPED BY COUNTRY CODE")
  // redis.set(keys.historical, string);
  // console.log(`Updated JHU CSSE Historical: ${removeFirstObj.length} locations`);
  return resultObj;
};

/**
 * Parses data from historical endpoint to and returns data for specific country. US requires more specialized data sanitization.
 * @param {*} data: full historical data returned from /historical endpoint
 * @param {*} country: country query param
 * @param {*} redis: redis server in case we need state names for USA
 * @param {*} keys: states keys for redis
 */
async function getHistoricalCountryData(data, country, redis=null, keys=null) {
  var countryData;
  const standardizedCountryName = countryMap.standardizeCountryName(country.toLowerCase());
  if (standardizedCountryName == "usa") {
    // get all valid states from redis
    let stateData = JSON.parse(await redis.get(keys));
    // const stateData = response.data;
    const states = stateData.map(obj => {
      return obj.state.toLowerCase();
    });
    // filter /historical data on country name and all valid US states
    countryData = data.filter(obj => {
      if (obj.province != null) {
        return obj.country.toLowerCase() == standardizedCountryName && states.filter(state => state == obj.province.toLowerCase()).length > 0;
      }
    });
  }
  else {
    // countries with null as province have one entry in /historical, but all others have province=country
    countryData = data.filter(obj => {
      return obj.country.toLowerCase() == standardizedCountryName;
    });
  }

  // overall timeline for country
  const timeline = {cases: {}, deaths: {}, recovered: {}};

  // sum over provinces
  for (var province = 0; province < countryData.length; province++) {
    // loop cases, recovered, deaths for each province
    Object.keys(countryData[province].timeline).forEach(specifier => {
      Object.keys(countryData[province].timeline[specifier]).forEach(date => {
        if (timeline[specifier][date]) {
          timeline[specifier][date] += parseInt(countryData[province].timeline[specifier][date]);
        }
        else {
          timeline[specifier][date] = parseInt(countryData[province].timeline[specifier][date]);
        }
      });
    });
  }

  return ({
    standardizedCountryName,
    timeline
  });

}

module.exports = {
  historical,
  getHistoricalCountryData
};
