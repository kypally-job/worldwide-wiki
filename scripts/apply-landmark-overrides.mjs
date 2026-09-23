import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("lib/world-catalog.json", "utf8"));

// Import landmark map by evaluating the TS file values — duplicate the constants here
const LANDMARK = {
  GE: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1200&q=80",
  PT: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
  KR: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  TH: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
  AR: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80",
  FR: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  IT: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
  ES: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
  DE: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
  GB: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
  US: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80",
  JP: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  AU: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
  NZ: "https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1200&q=80",
  BR: "https://images.unsplash.com/photo-1483729558449-99ef03a8a58dd?auto=format&fit=crop&w=1200&q=80",
  MX: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80",
  CA: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=80",
  IN: "https://images.unsplash.com/photo-1564507592333-c606f1818d1d?auto=format&fit=crop&w=1200&q=80",
  CN: "https://images.unsplash.com/photo-1508804185872-d7aad8140c8b?auto=format&fit=crop&w=1200&q=80",
  EG: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80",
  TR: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  GR: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80",
  NL: "https://images.unsplash.com/photo-1534351590666-13e3c96a5015?auto=format&fit=crop&w=1200&q=80",
  CH: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80",
  AT: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
  IE: "https://images.unsplash.com/photo-1590080875515-8a3a10ec1ae0?auto=format&fit=crop&w=1200&q=80",
  SE: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80",
  NO: "https://images.unsplash.com/photo-1520769945061-0a448009eafd?auto=format&fit=crop&w=1200&q=80",
  FI: "https://images.unsplash.com/photo-1536663815816-0c8f8a1e7c45?auto=format&fit=crop&w=1200&q=80",
  PL: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80",
  CZ: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80",
  HU: "https://images.unsplash.com/photo-1541343672885-9be56236302a?auto=format&fit=crop&w=1200&q=80",
  HR: "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1200&q=80",
  IS: "https://images.unsplash.com/photo-1476610182048-b716b8518abc?auto=format&fit=crop&w=1200&q=80",
  MA: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80",
  ZA: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80",
  KE: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
  VN: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  ID: "https://images.unsplash.com/photo-1537996194471-e657df975ab0?auto=format&fit=crop&w=1200&q=80",
  MY: "https://images.unsplash.com/photo-1596422846543-75c6fc71073c?auto=format&fit=crop&w=1200&q=80",
  SG: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  PH: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
  AE: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  IL: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=80",
  RU: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80",
  CL: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
  PE: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
  CO: "https://images.unsplash.com/photo-1534943441045-2a63f4b406c4?auto=format&fit=crop&w=1200&q=80",
  BE: "https://images.unsplash.com/photo-1491557345352-5759a6f4c1b0?auto=format&fit=crop&w=1200&q=80",
  DK: "https://images.unsplash.com/photo-1513622475202-4c4c9a6b0e3c?auto=format&fit=crop&w=1200&q=80",
  KH: "https://images.unsplash.com/photo-1609137144813-7d022415efe9?auto=format&fit=crop&w=1200&q=80",
  VA: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  MV: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
  NP: "https://images.unsplash.com/photo-1544735716-392fe40315e6?auto=format&fit=crop&w=1200&q=80",
  LT: "https://images.unsplash.com/photo-1565008447742-97f6f38c995c?auto=format&fit=crop&w=1200&q=80",
  LV: "https://images.unsplash.com/photo-1565008447742-97f6f38c995c?auto=format&fit=crop&w=1200&q=80",
  RO: "https://images.unsplash.com/photo-1565008447742-97f6f38c995c?auto=format&fit=crop&w=1200&q=80",
  EE: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=1200&q=80",
  UA: "https://images.unsplash.com/photo-1565008447742-97f6f38c995c?auto=format&fit=crop&w=1200&q=80",
  SA: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80",
};

for (const country of catalog.countries) {
  const code = String(country.countryCode || "").toUpperCase();
  if (LANDMARK[code]) country.imageUrl = LANDMARK[code];
}

writeFileSync("lib/world-catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);
console.log({
  unique: new Set(catalog.countries.map((c) => c.imageUrl)).size,
  landmarkApplied: Object.keys(LANDMARK).length,
});
