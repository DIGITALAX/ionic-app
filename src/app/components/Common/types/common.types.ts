export interface CoreContractAddresses {
  ionic: `0x${string}`;
  mona: `0x${string}`;
  appraisals: `0x${string}`;
  designers: `0x${string}`;
  conductors: `0x${string}`;
  reactionPacks: `0x${string}`;
}

export interface HeaderProps {
  dict: any;
}

export interface FallingImageBody {
  body: Matter.Body;
  imageIndex: number;
  id: string;
}

export interface FallingImage {
  id: string;
  x: number;
  y: number;
  imageIndex: number;
}

export interface NFT {
  id: string;
  nftId: string;
  nftContract: string;
  tokenId: string;
  submitter: string;
  tokenType: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  active: boolean;
  appraisalCount: string;
  totalScore: string;
  averageScore: string;
  metadata?: NFTMetadata;
  appraisals: Appraisal[];
}

export interface NFTMetadata {
  title: string;
  description: string;
  type: "image" | "video" | "text" | "audio";
  image?: string;
  video?: string;
  audio?: string;
  text?: string;
}

export interface Conductor {
  id: string;
  conductorId: string;
  uri: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  appraisalCount: string;
  totalScore: string;
  averageScore: string;
  reviewCount: string;
  totalReviewScore: string;
  averageReviewScore: string;
  inviteCount: string;
  availableInvites: string;
  metadata: BaseMetadata;
  invitedDesigners: Designer[];
  appraisals: Appraisal[];
  reviews: Review[];
}

export interface Designer {
  wallet: string;
  uri: string;
  metadata: BaseMetadata;
  invitedBy: Conductor;
  active: boolean;
  designerId: string;
  inviteTimestamp: string;
  packCount: string;
  reactionPacks: ReactionPack[];
}

export interface AppraisalData {
  nftId: number;
  nftContract: string;
  reactionUsage: ReactionUsage[];
  overallScore: number;
  comment: string;
  reactions: {
    emoji: string;
    count: number;
  }[];
}

export interface ReactionUsage {
  reactionId: number;
  count: number;
}

export interface Reaction {
  reactionId: string;
  packId: string;
  pack: ReactionPack;
  reactionMetadata: ReactionMetadata;
  reactionUri: string;
  tokenIds: string[];
}

export interface ReactionMetadata {
  title: string;
  image: string;
  description: string;
  model: string;
  workflow: string;
  prompt: string;
}

export interface ReactionPack {
  designer: string;
  designerProfile: Designer;
  packId: string;
  currentPrice: string;
  maxEditions: string;
  soldCount: string;
  basePrice: string;
  priceIncrement: string;
  conductorReservedSpots: string;
  active: boolean;
  packUri: string;
  packMetadata: BaseMetadata;
  reactions: Reaction[];
  purchases: Purchase[];
}

export interface Purchase {
  id: string;
  buyer: string;
  purchaseId: string;
  packId: string;
  price: string;
  editionNumber: string;
  shareWeight: string;
  timestamp: string;
  transactionHash: string;
  pack: ReactionPack;
}

export interface Reviewer {
  wallet: string;
  reviews: Review[];
  uri: string;
  metadata: BaseMetadata;
  blockTimestamp: string;
  transactionHash: string;
  reviewCount: string;
  totalScore: string;
  averageScore: string;
  lastReviewTimestamp: string;
}

export interface Review {
  reviewer: Reviewer;
  reviewId: string;
  conductorId: string;
  reviewScore: string;
  conductor: Conductor;
  timestamp: string;
  uri: string;
  reactions: { count: number; reactionId: string; reaction: Reaction }[];
  metadata: Metadata;
}

export interface Metadata {
  comment: string;
  reactions: { count: string; emoji: string }[];
}

export interface BaseMetadata {
  title: string;
  description: string;
  image: string;
}

export interface Appraisal {
  appraiser: string;
  nftId: string;
  nftContract: string;
  conductorId: string;
  appraisalId: string;
  overallScore: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  nft?: NFT;
  reactions: { count: number; reactionId: string; reaction: Reaction }[];
  metadata: Metadata;
  conductor: Conductor;
}

export interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export interface EmojiCount {
  [emoji: string]: number;
}
