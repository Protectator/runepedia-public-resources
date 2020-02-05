import simpleGit from 'simple-git';
import fs from 'fs';
import { request } from './request';

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

const start = async () => {
  for (let setUrl in setBundles) {
    const pathName = new URL(setUrl).pathname;
    const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
    const data = await request(setUrl);
    fs.closeSync(fs.openSync(fileName, 'w'));
    await fs.promises.writeFile(fileName, data);
  }
};
