import fetch from 'node-fetch';
import fs from 'node:fs';

async function fetchDogs () {
    let results = [];

    for (let page = 1; page <= 160; page++) {
        console.log(page);

        let getRequestUrl = generateGetDogUrl(page);
        let response = await fetch(getRequestUrl, {
            headers: {
                "Authorization": "Bearer "
            }
        });
        let data = await response.text();
    
        let jsonObj = JSON.parse(data);
    
        let records = jsonObj.animals;
        for (let index = 0; index < records.length; index++) {
            const record = records[index];
    
            let name = (String)(record.name).replaceAll(",", "/");
            let colors_primary = (String)(record.colors.primary).replaceAll(",", "/");
            let colors_secondary = (String)(record.colors.secondary).replaceAll(",", "/");
            let breed = (String)(record.breeds.primary).replaceAll(",", "/");

            let simpleObj = {
                id: record.id,
                name: name,
                type: record.type,
                size: record.size,
                gender: record.gender,
                age: record.age,
                colors_primary: colors_primary,
                colors_secondary: colors_secondary,
                breeds: breed,
            };
    
            results.push(simpleObj);
        }
    }

    var csvString = convertToCSV(results);
    fs.writeFileSync('testdata.csv', csvString);
}

function generateGetDogUrl(page) {
    return `https://api.petfinder.com/v2/animals?type=dog&status=adoptable&after=2023-11-20T00:00:00.000Z&before=2023-11-27T00:00:00.000Z&limit=100&page=${page}`;
}

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
}

fetchDogs ();
