const fs = require('fs');
const path = require('path');
const readline = require('readline');

const jsondata = {
  province: [],
  city: {},
  district: {},
};

function processFile(inputfile, outputfile) {
  return new Promise((resolve, reject) => {
    var rl = readline.createInterface({
      input: fs.createReadStream(inputfile),
    });

    rl.on('line', (line) => {
      const lineArray = line.split('\t');
      //console.log(lineArray[0], lineArray[1]);
      const adcode = parseInt(lineArray[1]);
      const label = lineArray[0];
      if (adcode % 100000 === 0 || adcode % 10000 === 0) {
        jsondata.province.push({key: adcode, label: label});
      } else if (adcode % 100 === 0) {
        const parent = adcode - (adcode % 10000);
        if (!jsondata.city[parent]) {
          jsondata.city[parent] = [];
        }
        jsondata.city[parent].push({key: adcode, label: label});
      } else if (adcode % 100 > 0) {
        const parent = adcode - (adcode % 100);
        if (!jsondata.district[parent]) {
          jsondata.district[parent] = [];
        }
        jsondata.district[parent].push({key: adcode, label: label});
      }
    });
    rl.on('close', () => {
      //console.log(jsondata);
      fs.writeFileSync(outputfile, JSON.stringify(jsondata), {
        encoding: 'utf-8',
      });
      resolve();
    });
  });
}

processFile('./data.txt', './adcode.json').then(function() {
  console.log('finish');
});
