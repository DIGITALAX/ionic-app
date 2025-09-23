import { gql } from "@apollo/client";
import { graphClient } from "../client";

const DESIGNER = `
query($wallet: String!) {
  designers(where: { wallet: $wallet }) {
    wallet
    invitedBy
    active
    designerId
    inviteTimestamp
    packCount
    uri
    metadata {
      title
      image
      description
    }
    reactionPacks {
        packId
        currentPrice
        maxEditions
        soldCount
        basePrice
        priceIncrement
        conductorReservedSpots
        active
        packUri
        reactions {
            reactionId
            reactionUri
            reactionMetadata {
              title
              image
              description
              model
              workflow
              prompt
            }
            tokenIds
        }
        purchases {
            buyer
            purchaseId
            packId
            price
            editionNumber
            shareWeight
            timestamp
            transactionHash
        }
    }
  }
}
`;

export const getDesigner = async (wallet: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(DESIGNER),
    variables: {
      wallet,
    },
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

const DESIGNER_PACKS = `
query($designer: String!, $first: Int!, $skip: Int!) {
  reactionPacks(where: { designer: $designer }, $first: Int!, $skip: Int!) {
      packId
      currentPrice
      maxEditions
      soldCount
      basePrice
      priceIncrement
      conductorReservedSpots
      active
      packUri
      packMetadata {
        image
        title
      }
  }
}
`;

export const getDesignerPacks = async (
  designer: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(DESIGNER_PACKS),
    variables: {
      designer,
      first,
      skip
    },
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
