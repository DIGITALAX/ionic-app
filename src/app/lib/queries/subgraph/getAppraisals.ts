import { gql } from "@apollo/client";
import { graphClient } from "../client";

const CONDUCTOR_APPRAISALS = `
query($conductorId: Int!, $first: Int!, $skip: Int!) {
  appraisals(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip, where: {conductorId: $conductorId}) {
    appraiser
    nftId
    nftContract
    tokenType
    conductorId
    appraisalId
    overallScore
    blockNumber
    blockTimestamp
    transactionHash
    uri
    metadata {
      comment
      reactions {
        emoji
        count
      }
    }
    reactions {
        reaction {
            reactionId
            packId
            reactionUri
            tokenIds
            reactionMetadata {
              image
              title
            }
        }
        count
    }
  }
}
`;

export const getConductorAppraisals = async (
  conductorId: number,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(CONDUCTOR_APPRAISALS),
    variables: { conductorId, first, skip },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
