/**
 * アイカツ公式の「店頭イベントxxxにチャレンジ！」から、開催情報を取得する
 */
import fs from 'fs';
import client from 'cheerio-httpcli';
import { StoreData } from '../src/types/shims';

/** 都道府県IDの最大値 */
const PREF_NUM_MAX = 47;
/** アクセス先のURL */
const baseUrl = 'https://www.aikatsu.com/onparade/event/challenge_yurika/shoplist_{0}.php?pref={1}';
/** 保存するファイル名(緯度経度無し) */
const filenamePrefix = 'tmp/01/challenge_yurika';
const filenameExt = '.json';

/** 1県分のイベント情報を取得 */
const fetchStoreData = async (typeId: number, prefId: number) => {
  const accessUrl = baseUrl.replace('{0}', `0${typeId}`).replace('{1}', `${prefId}`);
  const storeData: StoreData[] = [];

  const res = await client.fetch(accessUrl);
  const $ = res.$;

  // 県名
  const prefName = $('.pref_name').text();

  $('.compe_shoplist').each((index, elem) => {
    /** 店名 */
    const name = $(elem)
      .find('.shop_name')
      .text()
      .trim();
    /** 住所 */
    const address = $(elem)
      .find('.shop_address')
      .text()
      .trim();
    /** 電話番号 */
    const tel = $(elem)
      .find('.shop_phone')
      .text()
      .trim();

    // 開催情報
    const eventList: StoreData['eventList'] = [];
    $(elem)
      .find('.compe_schedule_detail > li')
      .each((sIndex, sElem) => {
        eventList.push({
          type: $(sElem)
            .find('.icon_terms')
            .text(),
          capacity: Number(
            $(sElem)
              .find('.compe_1l:nth-child(3) > dl:nth-child(2) > dd')
              .text()
              .replace('人', ''),
          ),
          date: $(sElem)
            .find('.compe_date')
            .text()
            .trim()
            .replace(/\s/g, '')
            .replace(/[\/～]/g, '')
            .replace(/\(.\)/, '')
            .replace(/[年月]/g, '/')
            .replace('日', ' '),
        });
      });

    storeData.push({
      prefId,
      prefName,
      name,
      address,
      tel,
      eventList,
    });
  });

  return storeData;
};

(async () => {
  for (let t = 1; t <= 3; t++) {
    const allList: StoreData[] = [];
    for (let i = 1; i <= PREF_NUM_MAX; i++) {
      let prefName: string = '';

      try {
        const storeDataList: StoreData[] = [];
        const store = await fetchStoreData(t, i);
        storeDataList.push(...store);
        allList.push(...store);
        // 県ごとに結果を出力
        // fs.writeFileSync(`${filenamePrefix}${i}${filenameExt}`, JSON.stringify(storeDataList, null, '  '));
      } catch (e) {
        console.log('----------------------------------------');
        console.log(`${prefName}でエラーがあった`);
        console.log(e);
      }
    }
    fs.writeFileSync(`${filenamePrefix}_map0${t}_${filenameExt}`, JSON.stringify(allList, null, '  '));
  }
})();
