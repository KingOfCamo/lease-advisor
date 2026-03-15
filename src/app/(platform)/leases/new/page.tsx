"use client";

import { PageHeader } from "@/components/layout/page-header";
import { WizardProvider, useWizard } from "@/components/lease-wizard/wizard-context";
import { WizardShell } from "@/components/lease-wizard/wizard-shell";
import { StepClient } from "@/components/lease-wizard/steps/step-client";
import { StepProperty } from "@/components/lease-wizard/steps/step-property";
import { StepPartiesTerm } from "@/components/lease-wizard/steps/step-parties-term";
import { StepRentReview } from "@/components/lease-wizard/steps/step-rent-review";
import { StepOutgoings } from "@/components/lease-wizard/steps/step-outgoings";
import { StepIncentives } from "@/components/lease-wizard/steps/step-incentives";
import { StepClauses } from "@/components/lease-wizard/steps/step-clauses";
import { StepReview } from "@/components/lease-wizard/steps/step-review";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

function NewLeaseContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") || "";

  return (
    <div>
      <PageHeader title="New Lease" description="Enter commercial lease terms" />
      <WizardProvider initialData={{ clientId }}>
        <WizardSteps />
      </WizardProvider>
    </div>
  );
}

export default function NewLeasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewLeaseContent />
    </Suspense>
  );
}
