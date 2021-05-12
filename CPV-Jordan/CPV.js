const fs = require("fs");
const csv = require("csv-parser");
const moment = require("moment");

let rotationsData = [];
let spotsData = [];

/* read csv files via fs.createReadStream */
const getFileData = async (fileName) => (
  new Promise(function(resolve){
    const rows = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      })
    })
);

/*
  Leveraging moment library to determine the rotations of each spot.
  Result will be addition of new "Rotations" array in spotsData array elements.

  Assumption: 
  If a spot falls within the timeframe for two rotations (say Time=3:30pm which is Afternoon and Primetime), 
  then include both rotations in result
*/
const setSpotsRotations = () => {
  spotsData.forEach((spot) => {
    const spotRotations = [];
    rotationsData.forEach((rotation) => {
      const currentTime = moment(spot.Time, "HH:mm a");
      const startTime = moment(rotation.Start, "HH:mm a");
      const endTime = moment(rotation.End, "HH:mm a");
      if (currentTime.isBetween(startTime, endTime)) {
        spotRotations.push(rotation.Name);
      }
    });
    spot.Rotations = spotRotations;
  });
};

/*  
    Overview: Creating a mapping of key-value pairs to map a given header to the 
    aggregate cost per view of that field.

    example for getCostPerViewMapping("Create", spotsData)):
    [
      { Creative: 'TEST001H', Spend: '240.50', Views: '110' },
      { Creative: 'TEST001H', Spend: '200', Views: '100' },
      { Creative: 'TEST002H', Spend: '500', Views: '80' }
    ] 
    =====>
    { 
      TEST001H: { cpv: 2.098, Spend: '440.50', Views: '210' },
      TEST002H: { cpv: 4, Spend: '500', Views: '80' }
    }
*/
const getCostPerViewMapping = (header, spots) => {
  const mapping = {};
  spots.forEach((spot) => {
    const costPerView = Number(spot.Spend)/Number(spot.Views);
    // Handle scenario where header may have multiple values (such as rotations)
    const fields = Array.isArray(spot[header]) ? spot[header] : [spot[header]];
    fields.forEach((field) => {
      mapping[field] = {
        Spend: (mapping[field]?.Spend || 0) + Number(spot.Spend),
        Views: (mapping[field]?.Views || 0) + Number(spot.Views),
        Cpv: (mapping[field]?.Cpv || 0) + Number(costPerView)
      };
    });
  });
  return mapping;
};

const getCpvPerDayPerRotation = () => {
  // create object mapping a given day to an array of spots
  const spotsByDay = {};
  spotsData.forEach((spot) => {
    if (!spotsByDay[spot.Date]) {
      spotsByDay[spot.Date] = [];
    }
    spotsByDay[spot.Date].push(spot);
  });

  // iterate through each day and calculate cpv per Rotation
  Object.keys(spotsByDay).forEach((day) => {
    const spots = spotsByDay[day];
    spotsByDay[day] = getCostPerViewMapping("Rotations", spots); //modifying spotsByDay in-place
  });
  return spotsByDay;
}

const main = async () => {
  // Read spots and rotations data from csv and set their rotations value
  rotationsData = await getFileData("rotations.csv");
  spotsData = await getFileData("spots.csv");
  setSpotsRotations();

  // Cost by Creative
  const cpvByCreative = getCostPerViewMapping("Creative", spotsData);

  // Cost by Rotation by Day
  const cpvByRotationByDay = getCpvPerDayPerRotation();

  // Output resulting tables to terminal
  console.log('\n');
  console.log("------------ Cost per view by Creative ------------------------");
  console.table(cpvByCreative);

  console.log("\n");
  console.log("------------ Cost per view by Rotation by Day -----------------");
  Object.keys(cpvByRotationByDay).forEach((day) => {
    console.log("Day: ", day);
    console.table(cpvByRotationByDay[day]);
    console.log('\n');
  });
}

main();