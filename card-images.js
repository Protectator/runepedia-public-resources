import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
// import { request } from './request.js';
import request from 'request';
import unzipper from 'unzipper';
const imagesRepo = simpleGit('./dist');

/*
The core bundles contain foundational assets and data that are shared across cards in all sets.
This includes information like factions, icons, queues, rules, etc.
Core bundles are available over the internet at the following url:

The core bundle once extracted will have the following structure:

core-{locale}/
├─ COPYRIGHT
├─ README.md
├─ metadata.json
└─ {locale}/
   ├─ data/
   │  └─ globals-{locale}.json
   └─ img/
      └─ regions/
         └─ icon_demacia.png
 */

// Ref : https://developer.riotgames.com/docs/lor#data-dragon_core-bundles
const coreBundles = [
  'https://dd.b.pvp.net/datadragon-core-en_us.zip'
];

/*
The set bundles contain assets and data for cards released in a specific set.
Set bundles are available in two versions; full and lite.
The full set bundle contains the card art, alternative art, and full size illustrations for each card.
The lite version only contains the card art and the alternative art making the lite version significantly smaller in size.
Set bundles are available over the internet at the following urls:

The set bundle once extracted will have the structure below.

set1-{locale}/
├── COPYRIGHT
├── README.md
├── metadata.json
└── {locale}/
    ├── data/
    │   └── set1-{locale}.json
    └── img/
        └── cards/
            ├── 01DE001.png
            ├── 01DE001-full.png (not included in lite bundles)
            ├── 01DE001-alt.png
            └── 01DE001-alt-full.png (not included in lite bundles)
 */
const setBundles = [
  'https://dd.b.pvp.net/datadragon-set1-en_us.zip'
];

(async () => {
  for (let setUrl of setBundles) {
    const pathName = new URL(setUrl).pathname;
    const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
    const fileNameWithoutExt = fileName.substring(0, pathName.lastIndexOf('.') - 1);

    const file = fs.createWriteStream(path.join('temp', path.sep, fileName));

    console.log("Downloading...");
    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
      let stream = request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: setUrl,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
          'Cache-Control': 'max-age=0',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        },
        /* GZIP true for most of the websites now, disable it if you don't need it */
        gzip: true
      })
        .pipe(file)
        .on('finish', () => {
          console.log(`The file is finished downloading.`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        })
    })
      .catch(error => {
        console.log(`Something happened: ${error}`);
      });
    console.log("Finished downloading with success. Unzipping...");

    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join('temp', path.sep, fileName))
        .pipe(unzipper.Extract({ path: path.join('dist', path.sep, fileNameWithoutExt) })
          .on('close', () => {
            console.log('Done !');
            resolve();
          })
          .on('error', (e) => {
            console.log('Sad : ', e);
            reject();
          })
        );
    });
  }
})();

