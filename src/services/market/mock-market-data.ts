import { MarketBenchmark, Comparable } from "../analysis/types";

const MARKET_BENCHMARKS: Record<string, Record<string, MarketBenchmark>> = {
  OFFICE: {
    melbourne_cbd: { rentPSQM: { low: 400, median: 550, high: 700 }, typicalIncentive: "20-30%", typicalReview: "CPI or 3.5-4% fixed" },
    inner_suburbs: { rentPSQM: { low: 250, median: 350, high: 450 }, typicalIncentive: "15-25%", typicalReview: "3-4% fixed" },
    outer_suburbs: { rentPSQM: { low: 150, median: 250, high: 350 }, typicalIncentive: "10-20%", typicalReview: "3-3.5% fixed" },
  },
  RETAIL: {
    melbourne_cbd: { rentPSQM: { low: 500, median: 800, high: 1200 }, typicalIncentive: "5-15%", typicalReview: "CPI or market" },
    strip_retail: { rentPSQM: { low: 300, median: 500, high: 800 }, typicalIncentive: "5-15%", typicalReview: "3-4% fixed or CPI" },
    shopping_centre: { rentPSQM: { low: 400, median: 700, high: 1200 }, typicalIncentive: "10-20%", typicalReview: "CPI + market" },
  },
  INDUSTRIAL: {
    metro: { rentPSQM: { low: 80, median: 120, high: 160 }, typicalIncentive: "5-10%", typicalReview: "3-3.5% fixed" },
    outer_metro: { rentPSQM: { low: 60, median: 90, high: 120 }, typicalIncentive: "0-5%", typicalReview: "3% fixed or CPI" },
  },
  MIXED_USE: {
    inner_suburbs: { rentPSQM: { low: 200, median: 350, high: 500 }, typicalIncentive: "10-20%", typicalReview: "3-4% fixed or CPI" },
  },
};

const CBD_POSTCODES = ["3000", "3001", "3002", "3003", "3004", "3005", "3006", "3008"];
const INNER_POSTCODES = [
  "3003", "3011", "3031", "3051", "3052", "3053", "3054", "3056", "3065", "3066",
  "3067", "3068", "3121", "3141", "3181", "3182", "3183", "3101", "3122", "3123",
];

function getSubmarket(propertyType: string, suburb: string, postcode: string): string {
  const isCBD = CBD_POSTCODES.includes(postcode) || suburb.toLowerCase() === "melbourne";
  const isInner = INNER_POSTCODES.includes(postcode);

  if (propertyType === "OFFICE") {
    if (isCBD) return "melbourne_cbd";
    if (isInner) return "inner_suburbs";
    return "outer_suburbs";
  }

  if (propertyType === "RETAIL") {
    if (isCBD) return "melbourne_cbd";
    if (isInner) return "strip_retail";
    return "strip_retail";
  }

  if (propertyType === "INDUSTRIAL") {
    if (isInner) return "metro";
    return "outer_metro";
  }

  return "inner_suburbs";
}

export function getMarketBenchmarks(
  propertyType: string,
  suburb: string,
  postcode: string
): MarketBenchmark {
  const submarket = getSubmarket(propertyType, suburb, postcode);
  const typeData = MARKET_BENCHMARKS[propertyType] || MARKET_BENCHMARKS.OFFICE;
  return typeData[submarket] || typeData[Object.keys(typeData)[0]];
}

const MOCK_COMPARABLES: Record<string, Comparable[]> = {
  RETAIL_CBD: [
    { address: "15 Centre Place", suburb: "Melbourne", propertyType: "Retail", nla: 55, rentPSQM: 1100, leaseTerm: "5 years", reviewType: "CPI" },
    { address: "8 Flinders Lane", suburb: "Melbourne", propertyType: "Retail", nla: 78, rentPSQM: 950, leaseTerm: "7 years", reviewType: "CPI + 1%" },
    { address: "42 Hardware Lane", suburb: "Melbourne", propertyType: "Retail", nla: 48, rentPSQM: 1250, leaseTerm: "5 years", reviewType: "Market" },
    { address: "3 Block Place", suburb: "Melbourne", propertyType: "Retail", nla: 35, rentPSQM: 1400, leaseTerm: "3 years", reviewType: "Market" },
  ],
  RETAIL_INNER: [
    { address: "210 Chapel St", suburb: "Prahran", propertyType: "Retail", nla: 95, rentPSQM: 580, leaseTerm: "5 years", reviewType: "3.5% fixed" },
    { address: "85 Greville St", suburb: "Prahran", propertyType: "Retail", nla: 65, rentPSQM: 620, leaseTerm: "5 years", reviewType: "CPI" },
    { address: "312 Smith St", suburb: "Collingwood", propertyType: "Retail", nla: 110, rentPSQM: 450, leaseTerm: "7 years", reviewType: "3% fixed" },
    { address: "48 Lygon St", suburb: "Carlton", propertyType: "Retail", nla: 80, rentPSQM: 550, leaseTerm: "5 years", reviewType: "CPI" },
  ],
  OFFICE_CBD: [
    { address: "Level 8, 600 Bourke St", suburb: "Melbourne", propertyType: "Office", nla: 120, rentPSQM: 580, leaseTerm: "5 years", reviewType: "3.5% fixed" },
    { address: "Suite 12, 101 Collins St", suburb: "Melbourne", propertyType: "Office", nla: 95, rentPSQM: 650, leaseTerm: "3 years", reviewType: "CPI" },
    { address: "Level 3, 55 King St", suburb: "Melbourne", propertyType: "Office", nla: 150, rentPSQM: 520, leaseTerm: "5 years", reviewType: "4% fixed" },
  ],
  INDUSTRIAL: [
    { address: "22 Princes Hwy", suburb: "Dandenong South", propertyType: "Industrial", nla: 500, rentPSQM: 115, leaseTerm: "10 years", reviewType: "3% fixed" },
    { address: "5 Westall Rd", suburb: "Clayton", propertyType: "Industrial", nla: 380, rentPSQM: 135, leaseTerm: "7 years", reviewType: "CPI" },
    { address: "18 Boundary Rd", suburb: "Laverton", propertyType: "Industrial", nla: 650, rentPSQM: 95, leaseTerm: "10 years", reviewType: "3.5% fixed" },
  ],
};

export function getComparables(
  propertyType: string,
  suburb: string,
  postcode: string
): Comparable[] {
  const isCBD = CBD_POSTCODES.includes(postcode);

  if (propertyType === "RETAIL") {
    return isCBD ? MOCK_COMPARABLES.RETAIL_CBD : MOCK_COMPARABLES.RETAIL_INNER;
  }
  if (propertyType === "OFFICE") {
    return MOCK_COMPARABLES.OFFICE_CBD;
  }
  if (propertyType === "INDUSTRIAL" || propertyType === "MIXED_USE") {
    return MOCK_COMPARABLES.INDUSTRIAL;
  }
  return MOCK_COMPARABLES.RETAIL_INNER;
}
