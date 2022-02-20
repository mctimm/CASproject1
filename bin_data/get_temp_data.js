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
let countries = JSON.parse(rawdata).records;
countries = [...new Set(countries.map((x) => x.countriesAndTerritories))];

let stuff = countries.map((element) => {
  return {
    country: element,
    temp: datamap.get(element),
  };
});

fs.writeFileSync(
  `average_temperature_for_our_countries.json`,
  JSON.stringify(stuff)
);
