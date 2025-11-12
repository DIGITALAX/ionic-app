import { gql } from "@apollo/client";
import { graphClient } from "../client";

const CONDUCTOR = `
query($conductorId: Int!) {
  conductors(where: {conductorId: $conductorId}) {
        conductorId
        uri
        metadata {
          title
          description
          image
        }
        blockNumber
        blockTimestamp
        transactionHash
        appraisalCount
        totalScore
        averageScore
        reviewCount
        totalReviewScore
        averageReviewScore
        inviteCount
        availableInvites
        invitedDesigners {
          wallet
          uri
          designerId
          metadata {
            title
            image
          }
        }
  }
}
`;

export const getConductor = async (conductorId: number): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(CONDUCTOR),
    variables: {
      conductorId,
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

export const getTokenReactions = async (tokenIds: number[]): Promise<any> => {
  const orConditions = tokenIds.map((id) => `{tokenId: ${id}}`).join(", ");

  const queryPromise = graphClient.query({
    query: gql(`
query {
  tokenReactions(where: {or: [${orConditions}]}) {
        reaction {
          reactionId
        packId
        reactionUri
        tokenIds
        reactionMetadata {
          title
          description
          image
        }
        }
  }
}
`),
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

const CONDUCTOR_PAGE = `
query($conductorId: Int!) {
  conductors(where: {conductorId: $conductorId}) {
        conductorId
        uri
        metadata {
          title
          description
          image
        }
        blockNumber
        blockTimestamp
        transactionHash
        appraisalCount
        totalScore
        averageScore
        reviewCount
        totalReviewScore
        averageReviewScore
        inviteCount
        availableInvites
        invitedDesigners {
          wallet
          uri
          designerId
          metadata {
            title
            image
          }
        }
        appraisals {
          nftId
          nftContract
          appraisalId
          overallScore
          blockTimestamp
          transactionHash
          uri
          tokenType
          metadata {
            comment
            reactions {
              emoji
              count
            }
          }
          reactions {
            reaction  {
              reactionId
              reactionUri
              reactionMetadata {
                title
                image
              }
            }
            count
          }

        }
        reviews {
          reviewId
          reviewScore
          timestamp
          uri
          reviewer {
            wallet
            uri
            metadata {
              title
              image
            }
          }
          reactions {
            count
            reaction {
              reactionId
              reactionUri
              reactionMetadata {
                image
                title
              }
            }
          }
          metadata {
            comment
            reactions {
              emoji
              count
            }          
          }
        }
  }
}
`;

export const getConductorPage = async (conductorId: number): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(CONDUCTOR_PAGE),
    variables: {
      conductorId,
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
