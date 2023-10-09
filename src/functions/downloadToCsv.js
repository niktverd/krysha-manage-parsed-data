const { getDocs, collection } = require('firebase/firestore/lite');
const { Parser } = require('json2csv');
var flatten = require('flat');

const {writeFileSync} = require('fs');

const db = require('../../firebase.ts');

const HOURS = 22;
const MINUTES = 1;

async function downloadToCsv() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    console.log(hours, ':', minutes);
    if (hours !== HOURS || minutes !==minutes ) {
        return;
    }

    console.log(flatten({x: 1, y: {z: 1}}));
    
    const colRef = collection(db, 'entries');
    const itemsSnap = await getDocs(colRef);

    const items = itemsSnap.docs.map(dSnap => {
        return flatten(dSnap.data());
    });

    
    const json2csvParser = new Parser();


    
    const parsed = json2csvParser.parse(items);

    writeFileSync(`output-${date.toISOString().split(0,10)}.csv`, parsed);

};

downloadToCsv();
