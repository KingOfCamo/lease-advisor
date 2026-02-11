import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.leaseAnalysis.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.property.deleteMany();
  await prisma.client.deleteMany();
  await prisma.businessSettings.deleteMany();

  // Create default business settings
  await prisma.businessSettings.create({
    data: {
      id: "default",
      companyName: "Ben Palmieri Consulting",
      tagline: "Director | Leasing Consultant",
      licenceNumber: "",
      email: "ben@palmieriproperty.com.au",
      phone: "0412 345 678",
      address: "Level 4, 360 Collins St, Melbourne VIC 3000",
      primaryColor: "#1e3a5f",
      disclaimer:
        "This report is advisory in nature and does not constitute legal advice. Ben Palmieri Consulting recommends seeking independent legal advice before acting on any recommendations.",
      termsOfEngagement: "",
    },
  });

  // ──── CLIENT 1: Landlord ────
  const client1 = await prisma.client.create({
    data: {
      businessName: "Palmieri Property Group",
      contactPerson: "Marco Palmieri",
      email: "marco@palmieriproperty.com.au",
      phone: "0413 555 201",
      clientType: "LANDLORD",
      abn: "12 345 678 901",
      status: "ACTIVE",
      notes: "Long-term client with growing commercial portfolio across Melbourne.",
    },
  });

  // Property 1: Prahran retail
  const property1 = await prisma.property.create({
    data: {
      address: "142 Chapel St",
      suburb: "Prahran",
      state: "VIC",
      postcode: "3181",
      propertyType: "RETAIL",
      nla: 120,
      propertyGrade: "B",
      isRetailLease: true,
    },
  });

  // Lease 1: Pizza shop — tenant-friendly lease
  await prisma.lease.create({
    data: {
      clientId: client1.id,
      propertyId: property1.id,
      leaseName: "Chapel St Pizza Shop",
      tenantName: "Tony's Woodfired Pizza Pty Ltd",
      landlordName: "Palmieri Property Group",
      commencementDate: new Date("2022-07-01"),
      expiryDate: new Date("2027-06-30"),
      totalTermMonths: 60,
      optionsToRenew: JSON.stringify([
        { termMonths: 60, conditions: "Same terms and conditions" },
      ]),
      baseRentPA: 78000,
      baseRentPSQM: 650,
      rentReviewMechanism: "FIXED_PERCENT",
      rentReviewDetail: "3% fixed increase annually on each anniversary of the commencement date",
      rentReviewFrequencyMonths: 12,
      hasRatchetClause: false,
      outgoingsStructure: "NET",
      outgoingsDetail: JSON.stringify({
        councilRates: 4200,
        waterRates: 1800,
        insurance: 3500,
        landTax: 5200,
        managementFee: 3900,
        structuralMaintenance: 2400,
        other: 800,
      }),
      outgoingsEstimatePA: 21800,
      permittedUse: "Restaurant and takeaway food premises",
      makeGoodObligations: "Tenant to make good to original condition, fair wear and tear excluded",
      fitoutContribution: 15000,
      rentFreePeriodMonths: 2,
      incentivesDetail: "2 months rent-free upon commencement, $15,000 fitout contribution",
      bondAmount: 19500,
      bondType: "BANK_GUARANTEE",
      bondReductionTerms: "Bond reduces to 2 months rent after 3 years of compliance",
      assignmentRights: "Tenant may assign with landlord consent, not to be unreasonably withheld. No requirement for assignee to demonstrate superior financial position.",
      sublettingRights: "Subletting permitted with landlord consent, not to be unreasonably withheld",
      defaultProvisions: "28 days written notice to remedy breach. Landlord may terminate if breach not remedied within cure period.",
      curePeriodDays: 28,
      demolitionClause: false,
      relocationClause: false,
      firstRightOfRefusal: true,
      specialConditions: "Tenant has first right of refusal on adjoining premises if they become available. Landlord to provide 24 hours notice before any building inspections.",
      status: "DRAFT",
    },
  });

  // Property 2: Melbourne CBD office
  const property2 = await prisma.property.create({
    data: {
      address: "Suite 501, 2 Queen St",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
      propertyType: "OFFICE",
      nla: 85,
      propertyGrade: "B",
      isRetailLease: false,
    },
  });

  // Lease 2: Accounting firm — balanced lease
  await prisma.lease.create({
    data: {
      clientId: client1.id,
      propertyId: property2.id,
      leaseName: "Queen St Accounting Office",
      tenantName: "Henderson & Associates Chartered Accountants",
      landlordName: "Palmieri Property Group",
      commencementDate: new Date("2023-01-01"),
      expiryDate: new Date("2025-12-31"),
      totalTermMonths: 36,
      optionsToRenew: JSON.stringify([
        { termMonths: 36, conditions: "Market review at option, CPI reviews during option term" },
      ]),
      baseRentPA: 55250,
      baseRentPSQM: 650,
      rentReviewMechanism: "CPI",
      rentReviewDetail: "CPI annual reviews during initial term, market review at option exercise",
      rentReviewFrequencyMonths: 12,
      hasRatchetClause: false,
      outgoingsStructure: "SEMI_GROSS",
      outgoingsDetail: JSON.stringify({
        councilRates: 0,
        waterRates: 0,
        insurance: 0,
        landTax: 0,
        managementFee: 2800,
        structuralMaintenance: 0,
        other: 1200,
      }),
      outgoingsEstimatePA: 4000,
      permittedUse: "Professional office — accounting and financial services",
      makeGoodObligations: "Tenant to make good to base building condition at lease end, fair wear and tear excluded",
      fitoutContribution: 0,
      rentFreePeriodMonths: 1,
      incentivesDetail: "1 month rent-free upon commencement",
      bondAmount: 13812,
      bondType: "CASH_BOND",
      bondReductionTerms: null,
      assignmentRights: "Assignment permitted with landlord consent, consent not to be unreasonably withheld. Assignee must demonstrate equivalent financial standing.",
      sublettingRights: "Subletting of part premises permitted with landlord consent",
      defaultProvisions: "14 days written notice to remedy breach.",
      curePeriodDays: 14,
      demolitionClause: false,
      relocationClause: false,
      firstRightOfRefusal: false,
      specialConditions: "Landlord to maintain common area air conditioning. Tenant responsible for supplementary cooling within premises.",
      status: "DRAFT",
    },
  });

  // Property 3: Dandenong South warehouse
  const property3 = await prisma.property.create({
    data: {
      address: "8 Industrial Ave",
      suburb: "Dandenong South",
      state: "VIC",
      postcode: "3175",
      propertyType: "INDUSTRIAL",
      nla: 450,
      propertyGrade: "C",
      isRetailLease: false,
    },
  });

  // Lease 3: Warehouse — landlord-friendly lease
  await prisma.lease.create({
    data: {
      clientId: client1.id,
      propertyId: property3.id,
      leaseName: "Dandenong South Warehouse",
      tenantName: "Metro Logistics Solutions Pty Ltd",
      landlordName: "Palmieri Property Group",
      commencementDate: new Date("2021-07-01"),
      expiryDate: new Date("2031-06-30"),
      totalTermMonths: 120,
      optionsToRenew: JSON.stringify([
        { termMonths: 60, conditions: "Market review at option exercise, 4% fixed reviews during option" },
        { termMonths: 60, conditions: "Market review at option exercise, 4% fixed reviews during option" },
      ]),
      baseRentPA: 58500,
      baseRentPSQM: 130,
      rentReviewMechanism: "FIXED_PERCENT",
      rentReviewDetail: "4% fixed increase annually. Ratchet clause applies — rent cannot decrease below previous year's rent at any review.",
      rentReviewFrequencyMonths: 12,
      hasRatchetClause: true,
      outgoingsStructure: "NET",
      outgoingsDetail: JSON.stringify({
        councilRates: 8500,
        waterRates: 3200,
        insurance: 7800,
        landTax: 9500,
        managementFee: 5850,
        structuralMaintenance: 4500,
        other: 2200,
      }),
      outgoingsEstimatePA: 41550,
      permittedUse: "Warehousing, distribution and light manufacturing",
      makeGoodObligations: "Tenant to make good to base building shell condition. All tenant fixtures and fittings to be removed. Floor to be restored to original condition.",
      fitoutContribution: 0,
      rentFreePeriodMonths: 0,
      incentivesDetail: null,
      bondAmount: 29250,
      bondType: "BANK_GUARANTEE",
      bondReductionTerms: null,
      assignmentRights: "Assignment only with landlord's prior written consent, which may be withheld at landlord's absolute discretion",
      sublettingRights: "No subletting permitted without landlord's prior written consent, which may be withheld at landlord's absolute discretion",
      defaultProvisions: "7 days written notice for rent default, 14 days for other breaches. Landlord may re-enter and terminate without further notice if breach not remedied.",
      curePeriodDays: 7,
      demolitionClause: true,
      relocationClause: true,
      firstRightOfRefusal: false,
      specialConditions: "Landlord retains right to demolish premises with 6 months notice. Landlord may relocate tenant to comparable premises within 5km radius. Tenant responsible for all structural and non-structural repairs.",
      status: "DRAFT",
    },
  });

  // ──── CLIENT 2: Tenant ────
  const client2 = await prisma.client.create({
    data: {
      businessName: "Harbour Coffee Co",
      contactPerson: "Sarah Chen",
      email: "sarah@harbourcoffee.com.au",
      phone: "0421 789 456",
      clientType: "TENANT",
      abn: "98 765 432 109",
      status: "ACTIVE",
      notes: "Growing specialty coffee business with two locations. Looking to optimize lease costs.",
    },
  });

  // Property 4: Degraves St cafe
  const property4 = await prisma.property.create({
    data: {
      address: "23 Degraves St",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
      propertyType: "RETAIL",
      nla: 65,
      propertyGrade: "A",
      isRetailLease: true,
    },
  });

  // Lease 4: Degraves St cafe — very landlord-friendly
  await prisma.lease.create({
    data: {
      clientId: client2.id,
      propertyId: property4.id,
      leaseName: "Degraves St Cafe",
      tenantName: "Harbour Coffee Co",
      landlordName: "Melbourne Laneway Holdings Pty Ltd",
      commencementDate: new Date("2023-06-01"),
      expiryDate: new Date("2028-05-31"),
      totalTermMonths: 60,
      optionsToRenew: JSON.stringify([
        { termMonths: 60, conditions: "Market review at option exercise, same review mechanism during option" },
      ]),
      baseRentPA: 97500,
      baseRentPSQM: 1500,
      rentReviewMechanism: "MARKET",
      rentReviewDetail: "Annual market rent review. No cap on increase. No floor. Determined by landlord's appointed valuer.",
      rentReviewFrequencyMonths: 12,
      hasRatchetClause: false,
      outgoingsStructure: "NET",
      outgoingsDetail: JSON.stringify({
        councilRates: 3800,
        waterRates: 2200,
        insurance: 4500,
        landTax: 6800,
        managementFee: 4875,
        structuralMaintenance: 3200,
        other: 1500,
      }),
      outgoingsEstimatePA: 26875,
      permittedUse: "Cafe and specialty coffee retail",
      makeGoodObligations: "Full make good to base building condition. Tenant responsible for all costs including removal of fitout, floor restoration, painting, and ceiling reinstatement.",
      fitoutContribution: 0,
      rentFreePeriodMonths: 0,
      incentivesDetail: null,
      bondAmount: 48750,
      bondType: "BANK_GUARANTEE",
      bondReductionTerms: null,
      assignmentRights: "Assignment only with landlord's consent, which may be withheld at landlord's absolute discretion. Outgoing tenant remains liable as guarantor for 12 months post-assignment.",
      sublettingRights: "No subletting permitted",
      defaultProvisions: "7 days written notice for rent default. Landlord may charge interest at 10% PA on overdue amounts.",
      curePeriodDays: 7,
      demolitionClause: false,
      relocationClause: false,
      firstRightOfRefusal: false,
      specialConditions: "Tenant must maintain minimum trading hours of 7am-5pm Monday to Saturday. Landlord approval required for any menu changes that alter the premises use. No signage modifications without landlord written approval.",
      status: "DRAFT",
    },
  });

  // Property 5: Collingwood roastery
  const property5 = await prisma.property.create({
    data: {
      address: "15 Smith St",
      suburb: "Collingwood",
      state: "VIC",
      postcode: "3066",
      propertyType: "MIXED_USE",
      nla: 180,
      propertyGrade: "C",
      isRetailLease: true,
    },
  });

  // Lease 5: Roastery — balanced
  await prisma.lease.create({
    data: {
      clientId: client2.id,
      propertyId: property5.id,
      leaseName: "Collingwood Roastery",
      tenantName: "Harbour Coffee Co",
      landlordName: "Smith Street Properties Pty Ltd",
      commencementDate: new Date("2022-03-01"),
      expiryDate: new Date("2029-02-28"),
      totalTermMonths: 84,
      optionsToRenew: JSON.stringify([
        { termMonths: 60, conditions: "CPI + 1% reviews continue, market review at option exercise" },
      ]),
      baseRentPA: 54000,
      baseRentPSQM: 300,
      rentReviewMechanism: "CPI_PLUS",
      rentReviewDetail: "CPI + 1% annually, with market review at option exercise only",
      rentReviewFrequencyMonths: 12,
      hasRatchetClause: false,
      outgoingsStructure: "SEMI_GROSS",
      outgoingsDetail: JSON.stringify({
        councilRates: 0,
        waterRates: 1600,
        insurance: 0,
        landTax: 0,
        managementFee: 2700,
        structuralMaintenance: 0,
        other: 900,
      }),
      outgoingsEstimatePA: 5200,
      permittedUse: "Coffee roasting, wholesale distribution, and retail cafe",
      makeGoodObligations: "Make good to original condition, fair wear and tear excluded. Landlord acknowledges tenant fitout improvements may remain with landlord consent.",
      fitoutContribution: 10000,
      rentFreePeriodMonths: 3,
      incentivesDetail: "3 months rent-free upon commencement, $10,000 fitout contribution toward roasting equipment ventilation",
      bondAmount: 13500,
      bondType: "BANK_GUARANTEE",
      bondReductionTerms: "Bond reduces by 25% after each 2 years of full compliance, minimum 1 month rent",
      assignmentRights: "Assignment permitted with landlord consent, not to be unreasonably withheld",
      sublettingRights: "Subletting of up to 30% of premises permitted with landlord consent",
      defaultProvisions: "21 days written notice to remedy breach. Landlord may not terminate for non-rent breaches if tenant demonstrates intent to remedy.",
      curePeriodDays: 21,
      demolitionClause: false,
      relocationClause: false,
      firstRightOfRefusal: false,
      specialConditions: "Tenant permitted to install and operate coffee roasting equipment subject to council approvals. Landlord to contribute 50% of costs for any required ventilation upgrades to common areas. Tenant may display external signage on Smith St frontage.",
      status: "DRAFT",
    },
  });

  console.log("Seed data created successfully!");
  console.log(`  - 2 clients`);
  console.log(`  - 5 properties`);
  console.log(`  - 5 leases`);
  console.log(`  - Business settings initialized`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
