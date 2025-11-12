import { gql } from "@apollo/client";
import { graphClient } from "../client";

const ALL_REACTIONS = `
query($first: Int!, $skip: Int!) {
  reactionPacks(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    designer
    designerProfile {
      uri
      metadata {
        title
        image
      }
    }
    packId
    currentPrice
    maxEditions
    soldCount
    conductorReservedSpots
    packUri
    packMetadata {
      title
      image
    }
    reactions {
        reactionId
        reactionMetadata {
          image
        }
    }
  }
}
`;

export const getAllReactions = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(ALL_REACTIONS),
    variables: {
      first,
      skip,
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



const REACTION_PACK = `
query($packId: Int!) {
  reactionPacks(where: {packId: $packId}) {
    designer
    packId
    designerProfile {
      uri
      metadata {
        title
        image
      }
    }
    currentPrice
    maxEditions
    soldCount
    basePrice
    priceIncrement
    conductorReservedSpots
    active
    packUri
    packMetadata {
      title
      image
      description
    }
    reactions {
        reactionId
        packId
        reactionUri
        tokenIds
        reactionMetadata {
          title
          image
          description
          model
          workflow
          prompt
        }
    }
    purchases {
        buyer
        purchaseId
        packId
        price
        transactionHash
        editionNumber
        shareWeight
        timestamp
    }
  }
}
`;

export const getReactionPack = async (
  packId: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(REACTION_PACK),
    variables: {
     packId
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
