export interface CityLocation {
  city: string;
  province: string;
  longitude: number;
  latitude: number;
  timezone: string;
  timezoneOffset: number;
}

export const cities: CityLocation[] = [
  { city: "北京", province: "北京", longitude: 116.4, latitude: 39.9, timezone: "Asia/Shanghai", timezoneOffset: 8 },
  { city: "上海", province: "上海", longitude: 121.47, latitude: 31.23, timezone: "Asia/Shanghai", timezoneOffset: 8 },
  { city: "广州", province: "广东", longitude: 113.26, latitude: 23.13, timezone: "Asia/Shanghai", timezoneOffset: 8 },
  { city: "深圳", province: "广东", longitude: 114.05, latitude: 22.55, timezone: "Asia/Shanghai", timezoneOffset: 8 },
  { city: "香港", province: "香港", longitude: 114.17, latitude: 22.32, timezone: "Asia/Hong_Kong", timezoneOffset: 8 },
  { city: "台北", province: "台湾", longitude: 121.56, latitude: 25.04, timezone: "Asia/Taipei", timezoneOffset: 8 },
  { city: "东京", province: "日本", longitude: 139.69, latitude: 35.69, timezone: "Asia/Tokyo", timezoneOffset: 9 },
  { city: "新加坡", province: "新加坡", longitude: 103.82, latitude: 1.35, timezone: "Asia/Singapore", timezoneOffset: 8 },
  { city: "洛杉矶", province: "美国", longitude: -118.24, latitude: 34.05, timezone: "America/Los_Angeles", timezoneOffset: -8 },
  { city: "纽约", province: "美国", longitude: -74.01, latitude: 40.71, timezone: "America/New_York", timezoneOffset: -5 }
];
