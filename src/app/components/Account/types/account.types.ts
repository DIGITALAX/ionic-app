export interface Appraisal {
  appraiser: string;
  nftId: string;
  conductorId: string;
  appraisalId: string;
  overallScore: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  metadata: {
    comment: string;
    reactions: { count: string; emoji: string }[];
  };
}

export interface ConductorFormData {
  title: string;
  description: string;
  image: File | null;
}