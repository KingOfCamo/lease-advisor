"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

export interface WizardData {
  // Step 1: Client selection
  clientId: string;
  createNewClient: boolean;
  newClientName: string;
  newClientType: string;
  newClientEmail: string;
  newClientPhone: string;

  // Step 2: Property
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  nla: number | null;
  propertyGrade: string;
  isRetailLease: boolean;

  // Step 3: Parties & Term
  leaseName: string;
  tenantName: string;
  landlordName: string;
  commencementDate: string;
  expiryDate: string;
  optionsToRenew: Array<{ termMonths: number; conditions: string }>;

  // Step 4: Rent & Reviews
  baseRentPA: number | null;
  rentReviewMechanism: string;
  rentReviewDetail: string;
  rentReviewFrequencyMonths: number;
  hasRatchetClause: boolean;
  fixedPercent: number | null;
  cpiMargin: number | null;
  marketCap: number | null;

  // Step 5: Outgoings
  outgoingsStructure: string;
  councilRates: number | null;
  waterRates: number | null;
  insurance: number | null;
  landTax: number | null;
  managementFee: number | null;
  structuralMaintenance: number | null;
  otherOutgoings: number | null;

  // Step 6: Incentives & Security
  fitoutContribution: number | null;
  rentFreePeriodMonths: number | null;
  incentivesDetail: string;
  bondAmount: number | null;
  bondType: string;
  bondReductionTerms: string;

  // Step 7: Key Clauses
  permittedUse: string;
  makeGoodObligations: string;
  assignmentRights: string;
  sublettingRights: string;
  defaultProvisions: string;
  curePeriodDays: number | null;
  demolitionClause: boolean;
  relocationClause: boolean;
  firstRightOfRefusal: boolean;

  // Step 8: Special Conditions
  specialConditions: string;
}

export const defaultWizardData: WizardData = {
  clientId: "",
  createNewClient: false,
  newClientName: "",
  newClientType: "",
  newClientEmail: "",
  newClientPhone: "",
  address: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  propertyType: "",
  nla: null,
  propertyGrade: "",
  isRetailLease: false,
  leaseName: "",
  tenantName: "",
  landlordName: "",
  commencementDate: "",
  expiryDate: "",
  optionsToRenew: [],
  baseRentPA: null,
  rentReviewMechanism: "",
  rentReviewDetail: "",
  rentReviewFrequencyMonths: 12,
  hasRatchetClause: false,
  fixedPercent: null,
  cpiMargin: null,
  marketCap: null,
  outgoingsStructure: "",
  councilRates: null,
  waterRates: null,
  insurance: null,
  landTax: null,
  managementFee: null,
  structuralMaintenance: null,
  otherOutgoings: null,
  fitoutContribution: null,
  rentFreePeriodMonths: null,
  incentivesDetail: "",
  bondAmount: null,
  bondType: "",
  bondReductionTerms: "",
  permittedUse: "",
  makeGoodObligations: "",
  assignmentRights: "",
  sublettingRights: "",
  defaultProvisions: "",
  curePeriodDays: null,
  demolitionClause: false,
  relocationClause: false,
  firstRightOfRefusal: false,
  specialConditions: "",
};

interface WizardState {
  currentStep: number;
  data: WizardData;
}

type WizardAction =
  | { type: "SET_STEP"; step: number }
  | { type: "UPDATE_DATA"; data: Partial<WizardData> }
  | { type: "RESET" }
  | { type: "PREFILL"; data: Partial<WizardData> };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "UPDATE_DATA":
      return { ...state, data: { ...state.data, ...action.data } };
    case "RESET":
      return { currentStep: 0, data: defaultWizardData };
    case "PREFILL":
      return { ...state, data: { ...state.data, ...action.data } };
    default:
      return state;
  }
}

interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (data: Partial<WizardData>) => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: Partial<WizardData>;
}) {
  const [state, dispatch] = useReducer(wizardReducer, {
    currentStep: 0,
    data: { ...defaultWizardData, ...initialData },
  });

  const nextStep = () =>
    dispatch({ type: "SET_STEP", step: Math.min(state.currentStep + 1, 7) });
  const prevStep = () =>
    dispatch({ type: "SET_STEP", step: Math.max(state.currentStep - 1, 0) });
  const goToStep = (step: number) => dispatch({ type: "SET_STEP", step });
  const updateData = (data: Partial<WizardData>) =>
    dispatch({ type: "UPDATE_DATA", data });

  return (
    <WizardContext.Provider
      value={{ state, dispatch, nextStep, prevStep, goToStep, updateData }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error("useWizard must be used within WizardProvider");
  return context;
}
