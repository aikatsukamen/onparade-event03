import fs from 'fs';
import path from 'path';
import { StoreData } from '../src/types/shims';

/** 都道府県IDの最大値。47都道府県 */
const prefMax = 47;
const inputFilenamePrefix = './tmp/01/challenge_yurika_map01_.json';
const outputFilenamePrefix = './tmp/02/challenge_yurika_map01_.json';

(async () => {
  try {
    const storeDataList: StoreData[] = require(path.resolve(`${inputFilenamePrefix}`));

    const result: [string, string | number][] = [['都道府県', '回数']];
    let tokyo23 = 0;
    for (let prefId = 1; prefId <= prefMax; prefId++) {
      // 一つの県に絞り込む
      const prefData = storeDataList.filter(data => data.prefId === prefId);
      if (prefData.length === 0) {
        if (prefId === 9 && tokyo23 !== 0) {
          result.push(['東京', tokyo23]);
        }
        continue;
      }

      let count = prefId === 9 ? tokyo23 : 0;
      prefData.map(data => {
        count += data.eventList.length;
      });

      if (prefId !== 8) {
        result.push([prefData[0].prefName.replace(/[県府区23]/g, '').replace('東京都', '東京'), count]);
      } else {
        tokyo23 = count;
      }
    }
    fs.writeFileSync(`${outputFilenamePrefix}`, JSON.stringify(result, null, '  '));
  } catch (e) {
    console.log(e);
  }
})();
