import IonicConductors from "./IonicConductors.json";
import IonicAppraisals from "./IonicAppraisals.json";
import IonicDesigners from "./IonicDesigners.json";
import IonicReactionPacks from "./IonicReactionPacks.json";

export const ABIS = {
  IonicConductors,
  IonicAppraisals,
  IonicDesigners,
  IonicReactionPacks,
} as const;

export const getABI = (contractName: keyof typeof ABIS) => {
  return ABIS[contractName];
};
