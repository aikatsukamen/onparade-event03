declare module '*.png' {
  const path: string;
  export default path;
}

declare module '*.gif' {
  const path: string;
  export default path;
}

declare interface Window {}

declare module '*.json' {
  const store: StoreData[];
  export default store;
}

/** 店舗情報 */
export type StoreData = {
  /** 県ID */
  prefId: number;
  /** 県名 */
  prefName: string;
  /** 店舗名 */
  name: string;
  /** 住所 */
  address: string;
  /** 電話番号 */
  tel: string;
  /** イベントリスト */
  eventList: {
    /** 年齢区分 */
    type: string;
    /** 日時 */
    date: string;
    /** 定員 */
    capacity: number;
  }[];
};
