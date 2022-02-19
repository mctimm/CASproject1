"use strict";

// this gathers the data for a single country.
const fs = require("fs");

let country_code1 = "FR";
let country_code2 = "IT";

let rawdata = fs.readFileSync("countries.json");
let countries = JSON.parse(rawdata).records;

const getCountryJson = (country_code, records) => {
  let country_data = records.filter(
    (x) => x.geoId === country_code && x.cases >= 0
  );
  let max = Math.max(...country_data.map((x) => x.cases));
  console.log(max);
  let binned_data = country_data
    .map((x) => {
      x.binned = Math.floor((x.cases / max) * 100);
      return x;
    })
    .sort((x, y) => {
      return new Date(x.dateRep) - new Date(y.dateRep);
    });
  // console.dir(binned_data);
  let data = JSON.stringify(binned_data);
  fs.writeFileSync(`${country_code}_binned_data.json`, data);
  return binned_data;
};

// TODO problem to answer: how do we handle date mismatch?
let country1 = getCountryJson(country_code1, countries);
let country2 = getCountryJson(country_code2, countries);

let dates1 = country1.map((x) => x.dateRep);
let dates2 = country2.map((x) => x.dateRep);
let not_included_dates1 = [];
let not_included_dates2 = [];
let sum = 0;
dates1.forEach((element) => {
  if (dates2.includes(element)) {
    sum += 1;
  } else {
    not_included_dates1.push(element);
  }
});
dates2.forEach((element) => {
  if (dates1.includes(element)) {
    sum += 1;
  } else {
    not_included_dates2.push(element);
  }
});

country1 = country1.filter((x) => !not_included_dates1.includes(x.dateRep));
country2 = country2.filter((x) => !not_included_dates2.includes(x.dateRep));
let country1_binned = bin(country1);
let country2_binned = bin(country2);
function bin(arr) {
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
}

// country2 = country2.filter((x) => !not_included_dates2.includes(x.dateRep));
// console.log(country2.length);
// console.log(country1.length);

let jiditString = "";
for (let index = country1_binned.length - 1; index >= 0; index--) {
  jiditString += country1_binned[index] + " " + country2_binned[index] + "\n";
}
fs.writeFileSync(
  `${country_code1} - ${country_code2} 7 day average - for_jidit.txt`,
  jiditString
);
// console.log(`${sum} + ${not_included_dates.length}/${dates1.length} `);
