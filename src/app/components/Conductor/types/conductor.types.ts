import { ReactionUsage } from "../../Common/types/common.types";

export interface ReviewData {
  reviewScore: number;
  comment: string;
  conductorId: number;
  reactionUsage: ReactionUsage[];
  reactions: {
    emoji: string;
    count: number;
  }[];
}
