import adcodeJson from './adcode.json';

export function getCodeInfo(adcode) {
  const districtCode = parseInt(adcode);
  const cityCode = adcode - (adcode % 100);
  const provinceCode = adcode - (adcode % 10000);
  let provinceLabel = '';
  for (let i = 0; i < adcodeJson.province.length; i++) {
    const p = adcodeJson.province[i];
    if (p && p.key === provinceCode) {
      provinceLabel = p.label;
    }
  }

  let cityLabel = '';
  const citys = adcodeJson.city[provinceCode];
  if (citys) {
    for (let i = 0; i < citys.length; i++) {
      if (citys[i].key === cityCode) {
        cityLabel = citys[i].label;
      }
    }
  }

  let districtLabel = '';
  const districts = adcodeJson.district[cityCode];
  if (districts) {
    for (let i = 0; i < districts.length; i++) {
      if (districts[i].key === districtCode) {
        districtLabel = districts[i].label;
      }
    }
  }

  return {
    district: districtCode,
    districtName: districtLabel,
    cityName: cityLabel,
    city: cityCode,
    province: provinceCode,
    provinceName: provinceLabel,
  };
}
