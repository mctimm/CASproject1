"use strict";

// filter for days that are contained by both datasets only.

const date_intersection = (country1, country2) => {
  let dates1 = country1.map((x) => x.dateRep);
  let dates2 = country2.map((x) => x.dateRep);

  let nonos1 = country1
    .filter((x) => x.cases === null || x.cases < 0)
    .map((x) => x.dateRep);
  let nonos2 = country2
    .filter((x) => x.cases === null || x.cases < 0)
    .map((x) => x.dateRep);
  let not_included_dates1 = nonos1.concat(nonos2);
  let not_included_dates2 = nonos1.concat(nonos2);
  dates1.forEach((element) => {
    if (dates2.includes(element)) {
    } else {
      not_included_dates1.push(element);
    }
  });
  dates2.forEach((element) => {
    if (dates1.includes(element)) {
    } else {
      not_included_dates2.push(element);
    }
  });

  country1 = country1
    .filter((x) => !not_included_dates1.includes(x.dateRep))
    .sort((x, y) => {
      return new Date(x.dateRep) - new Date(y.dateRep);
    });
  country2 = country2
    .filter((x) => !not_included_dates2.includes(x.dateRep))
    .sort((x, y) => {
      return new Date(x.dateRep) - new Date(y.dateRep);
    });
  if (country1.length != country2.length) {
    console.log(
      "" +
        country1[0].countryterritoryCode +
        " - " +
        country1.length +
        " , " +
        country2[0].countryterritoryCode +
        " - " +
        country2.length
    );
  }
  return {
    c1: country1,
    c2: country2,
  };
};

const comparison_by_date = (country1, country2) => {
  let data = date_intersection(country1, country2);
  return data.c1.length;
};

// displays a statistical calculation for how many days each of the data points shares.
// average for all was 703 with nulls.
const matching_days = (countries, country_codes) => {
  let matches = [];
  for (let index = 0; index < country_codes.length; index++) {
    const ccode = country_codes[index];
    for (let index2 = index + 1; index2 < country_codes.length; index2++) {
      const ccode2 = country_codes[index2];
      let average_matching = comparison_by_date(
        countries.filter((y) => y.countryterritoryCode === ccode),
        countries.filter((y) => y.countryterritoryCode === ccode2)
      );
      console.log(`${ccode} - ${ccode2} | Matching : ${average_matching}`);
      matches.push(average_matching);
    }
  }
  console.log(
    `${matches.reduce((x, y) => x + y, 0) / matches.length} Matches on average`
  );
};

// bins data with a 7 day average.
const bin = (arr) => {
  let binnedavg = [];
  for (let index = 6; index < arr.length - 7; index++) {
    binnedavg.push(
      arr
        .slice(index - 6, index)
        .reduce((x, y) => parseInt(x) + parseInt(y.cases), 0)
    );
  }
  let max = Math.max(...binnedavg);
  binnedavg = binnedavg.map((x) => {
    let y = Math.floor((x / max) * 100);
    return y;
  });
  return binnedavg;
};

const stringify_data = (binned_data) => {
  return binned_data.join(",");
};

const sum_data = (binned_data) => {
  return binned_data.reduce((x, y) => x + y, 0);
};

const makeAnonObj = (c1code, c1data, c2code, c2data) => {
  return {
    c1_code: c1code,
    c1_data: stringify_data(c1data),
    c2_code: c2code,
    c2_data: stringify_data(c2data),
  };
};

const makeDataPoint = (c1_code, c2_code, countries) => {
  let data = date_intersection(
    countries.filter((y) => y.countryterritoryCode === c1_code),
    countries.filter((y) => y.countryterritoryCode === c2_code)
  );
  const c1_data = bin(data.c1);
  const c2_data = bin(data.c2);
  return makeAnonObj(c1_code, c1_data, c2_code, c2_data);
};
const printProgress = (progress) => {
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
};

const get_matching_data = (countries, country_codes) => {
  let data = [];
  for (let index = 0; index < country_codes.length; index++) {
    const ccode = country_codes[index];
    for (let index2 = 0; index2 < country_codes.length; index2++) {
      // for (let index2 = 0; index2 < country_codes.length; index2++) {
      const ccode2 = country_codes[index2];
      if (!(ccode === ccode2)) {
        let obj = makeDataPoint(ccode, ccode2, countries);
        printProgress(`${index}/${country_codes.length}`);
        data.push(obj);
      }
    }
  }
  return data;
};

const fs = require("fs");
let rawdata = fs.readFileSync("countries.json");
let countries = JSON.parse(rawdata).records;
let country_codes = [...new Set(countries.map((x) => x.countryterritoryCode))];
// let country_codes = [
//   ...new Set(countries.map((x) => x.countriesAndTerritories)),
// ];
console.log(country_codes);
// matching_days(countries, country_codes);
// let data = get_matching_data(countries, country_codes);

// fs.writeFileSync(
//   `matching_data/OverallMatchingData_thrd.json`,
//   JSON.stringify(data)
// );
