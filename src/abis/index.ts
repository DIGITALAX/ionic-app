import IonicConductors from "./IonicConductors.json";
import IonicAppraisals from "./IonicAppraisals.json";
import IonicDesigners from "./IonicDesigners.json";
import IonicReactionPacks from "./IonicReactionPacks.json";
import IonicNFT from "./IonicNFT.json";

export const ABIS = {
  IonicConductors,
  IonicAppraisals,
  IonicDesigners,
  IonicReactionPacks,
  IonicNFT
} as const;

export const getABI = (contractName: keyof typeof ABIS) => {
  return ABIS[contractName];
};
