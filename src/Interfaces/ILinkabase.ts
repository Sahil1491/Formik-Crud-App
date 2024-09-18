export interface ILinkabaseData {
  step1: Step1Values;
  step2: Step2Values;
}

export interface Step1Values {
  relayType: string;
  simNumber: string;
  sorakomAccount: string;
  comment: string;
}

export interface Step2Values {
  rows: Array<{

    signalLight: string;
    targetType: string;
    target: string;
    relay: string;
    status: string;
    comment: string;

  }>;
}

export interface CombinedValues {
  step1: Step1Values;
  step2: Step2Values;
}
