const fs = require("fs");
let rawdata = fs.readFileSync("temp_data.txt");
let datamap = new Map();
let data = rawdata
  .toString()
  .split("\n")
  .map((x) => {
    let stuff = x.split(":");
    datamap.set(stuff[0].trim(), parseFloat(stuff[1]));
  });
console.log(datamap);

rawdata = fs.readFileSync("countries.json");
let countries2 = JSON.parse(rawdata).records;
let countries = [...new Set(countries2.map((x) => x.countriesAndTerritories))];

let stuff = countries.map((element) => {
  return {
    country: countries2.filter((x) => element == x.countriesAndTerritories)[0]
      .countryterritoryCode,
    temp: datamap.get(element),
  };
});

fs.writeFileSync(
  `average_temperature_for_our_countries.json`,
  JSON.stringify(stuff)
);
