"use strict";

// this gathers the data for a single country.
const fs = require("fs");

let country_code1 = "FR";
let country_code2 = "IT";

let rawdata = fs.readFileSync("countries.json");
let countries = JSON.parse(rawdata).records;

fs.writeFileSync(`${country_code}_for_jidit.txt`, jiditString);

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
};

// TODO problem to answer: how do we handle date mismatch?
country1 = getCountryJson(country_code1, countries);
country2 = getCountryJson(country_code2, countries);

let jiditString = binned_data.reduce((x, y) => x + y.binned + "\n", "");
console.log(jiditString);
