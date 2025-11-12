import { gql } from "@apollo/client";
import { graphClient } from "../client";

const ALL_NFTS = `
query($first: Int!, $skip: Int!) {
  nfts(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
    nftId
    nftContract
    tokenId
    submitter
    tokenType
    blockNumber
    blockTimestamp
    transactionHash
    active
    appraisalCount
    totalScore
    averageScore
  }
}
`;

export const getAllNFTs = async (first: number, skip: number): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(ALL_NFTS),
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

const NOT_APPRAISED = `
query($conductorId: Int!, $first: Int!, $skip: Int!) {
  conductors(where: {conductorId: $conductorId}, first: $first, skip: $skip) {
    notAppraised {
      nftId
      nftContract
      tokenId
      submitter
      tokenType
      blockNumber
      blockTimestamp
      transactionHash
      active
      appraisalCount
      totalScore
      averageScore
    }
  }
}
`;

export const getNotAppraisedNFTs = async (
  conductorId: number,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(NOT_APPRAISED),
    variables: {
      conductorId,
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

const ONE_NFT = `
query($nftContract: String!, $nftId: Int!) {
  nfts(where: {nftContract: $nftContract, nftId: $nftId}) {
      nftId
      nftContract
      tokenId
      submitter
      tokenType
      blockNumber
      blockTimestamp
      transactionHash
      active
      appraisalCount
      totalScore
      averageScore
      appraisals {
        appraiser
        appraisalId
        conductorId
        overallScore
        blockNumber
        blockTimestamp
        transactionHash
        uri
        nftId
        nftContract
        conductor {
          conductorId
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
            packId
            reactionUri
            reactionMetadata {
              title
              image
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

export const getOneNFT = async (
  nftContract: string,
  nftId: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(ONE_NFT),
    variables: {
      nftContract,
      nftId,
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
