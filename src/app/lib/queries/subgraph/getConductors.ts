import { gql } from "@apollo/client";
import { graphClient } from "../client";


const CONDUCTOR = `
query($wallet: String!) {
  conductors(where: {wallet: $wallet}) {
        wallet
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
          metadata {
            title
            image
          }
        }
  }
}
`;

export const getConductor = async (
  wallet: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(CONDUCTOR),
    variables: {
      wallet
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


export const getTokenReactions = async (
  tokenIds: number[]
): Promise<any> => {
  const orConditions = tokenIds.map(id => ({ tokenId: id.toString() }));
  
  const queryPromise = graphClient.query({
    query: gql(`
query {
  reactions(where: {or: ${orConditions}}) {
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
query($wallet: String!) {
  conductors(where: {wallet: $wallet}) {
        wallet
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

export const getConductorPage = async (
  wallet: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(CONDUCTOR_PAGE),
    variables: {
      wallet
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
