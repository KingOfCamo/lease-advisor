"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WizardProvider } from "@/components/lease-wizard/wizard-context";
import { WizardShell } from "@/components/lease-wizard/wizard-shell";
import { StepClient } from "@/components/lease-wizard/steps/step-client";
import { StepProperty } from "@/components/lease-wizard/steps/step-property";
import { StepPartiesTerm } from "@/components/lease-wizard/steps/step-parties-term";
import { StepRentReview } from "@/components/lease-wizard/steps/step-rent-review";
import { StepOutgoings } from "@/components/lease-wizard/steps/step-outgoings";
import { StepIncentives } from "@/components/lease-wizard/steps/step-incentives";
import { StepClauses } from "@/components/lease-wizard/steps/step-clauses";
import { StepReview } from "@/components/lease-wizard/steps/step-review";
import { useWizard } from "@/components/lease-wizard/wizard-context";
import type { WizardData } from "@/components/lease-wizard/wizard-context";

// Mock extracted data templates
const MOCK_EXTRACTIONS: Partial<WizardData>[] = [
  {
    address: "Level 3, 180 Flinders St",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
    propertyType: "OFFICE",
    nla: 200,
    propertyGrade: "A",
    isRetailLease: false,
    leaseName: "Flinders St Office",
    tenantName: "Digital Solutions Pty Ltd",
    landlordName: "CBD Tower Management",
    commencementDate: "2024-01-01",
    expiryDate: "2029-12-31",
    baseRentPA: 120000,
    rentReviewMechanism: "CPI_PLUS",
    rentReviewDetail: "CPI + 1% annually",
    rentReviewFrequencyMonths: 12,
    hasRatchetClause: false,
    cpiMargin: 1,
    outgoingsStructure: "SEMI_GROSS",
    councilRates: 0,
    waterRates: 0,
    insurance: 0,
    landTax: 0,
    managementFee: 4800,
    structuralMaintenance: 0,
    otherOutgoings: 2400,
    bondAmount: 30000,
    bondType: "BANK_GUARANTEE",
    permittedUse: "General office and professional services",
    makeGoodObligations: "Make good to base building condition, fair wear and tear excluded",
    assignmentRights: "Assignment with landlord consent, not to be unreasonably withheld",
    sublettingRights: "Subletting up to 25% permitted with consent",
  },
  {
    address: "Shop 4, 88 Brunswick St",
    suburb: "Fitzroy",
    state: "VIC",
    postcode: "3065",
    propertyType: "RETAIL",
    nla: 90,
    propertyGrade: "B",
    isRetailLease: true,
    leaseName: "Brunswick St Retail",
    tenantName: "Artisan Bakery Co",
    landlordName: "Fitzroy Holdings Trust",
    commencementDate: "2023-07-01",
    expiryDate: "2028-06-30",
    baseRentPA: 63000,
    rentReviewMechanism: "FIXED_PERCENT",
    rentReviewDetail: "3.5% fixed increase annually",
    rentReviewFrequencyMonths: 12,
    hasRatchetClause: false,
    fixedPercent: 3.5,
    outgoingsStructure: "NET",
    councilRates: 3200,
    waterRates: 1400,
    insurance: 2800,
    landTax: 4100,
    managementFee: 3150,
    structuralMaintenance: 1800,
    otherOutgoings: 600,
    bondAmount: 15750,
    bondType: "BANK_GUARANTEE",
    fitoutContribution: 8000,
    rentFreePeriodMonths: 1,
    permittedUse: "Bakery and cafe",
    makeGoodObligations: "Full make good to original condition",
    assignmentRights: "Landlord consent required, absolute discretion",
    sublettingRights: "No subletting",
  },
];

function UploadZone({ onExtract }: { onExtract: (data: Partial<WizardData>) => void }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const processFile = async (file: File) => {
    setFileName(file.name);
    setUploading(true);
    // Simulate extraction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const mockData = MOCK_EXTRACTIONS[Math.floor(Math.random() * MOCK_EXTRACTIONS.length)];
    setUploading(false);
    onExtract(mockData);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed rounded-lg p-12 text-center hover:border-navy-400 transition-colors"
    >
      {uploading ? (
        <div className="space-y-3">
          <div className="animate-spin mx-auto h-8 w-8 border-2 border-navy-700 border-t-transparent rounded-full" />
          <p className="text-sm font-medium">Extracting lease terms from {fileName}...</p>
          <p className="text-xs text-muted-foreground">This may take a moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Drop a lease PDF here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse (max 20MB)
            </p>
          </div>
          <label>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>
                <FileText className="mr-2 h-4 w-4" />
                Choose File
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}

function WizardSteps() {
  const { state } = useWizard();
  const steps = [
    <StepClient key="client" />,
    <StepProperty key="property" />,
    <StepPartiesTerm key="parties" />,
    <StepRentReview key="rent" />,
    <StepOutgoings key="outgoings" />,
    <StepIncentives key="incentives" />,
    <StepClauses key="clauses" />,
    <StepReview key="review" />,
  ];
  return <WizardShell>{steps[state.currentStep]}</WizardShell>;
}

export default function UploadPage() {
  const [extractedData, setExtractedData] = useState<Partial<WizardData> | null>(null);
  const router = useRouter();

  if (extractedData) {
    return (
      <div>
        <PageHeader
          title="Review Extracted Lease"
          description="Lease terms extracted — please review and correct before saving"
        />
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Terms have been pre-filled from the uploaded
            PDF. Please review each field carefully and correct any errors before
            saving.
          </p>
        </div>
        <WizardProvider initialData={extractedData}>
          <WizardSteps />
        </WizardProvider>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Upload Lease PDF"
        description="Upload a commercial lease document to extract terms automatically"
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Lease Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadZone onExtract={setExtractedData} />
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push("/leases/new")}
              className="text-sm"
            >
              or enter lease details manually
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
