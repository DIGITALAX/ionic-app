import { gql } from "@apollo/client";
import { graphClient } from "../client";


const REVIEWER = `
query($wallet: String!) {
  reviewers(where: {wallet: $wallet}) {
    wallet
    uri
    reviewCount
    totalScore
    averageScore
    lastReviewTimestamp
    metadata {
      title
      description
      image
    }
  }
}
`;

export const getReviewer = async (wallet: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(REVIEWER),
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

const REVIEWS = `
query($wallet: String!,$first: Int!, $skip: Int!) {
  reviews(where: {wallet: $wallet},first: $first, skip: $skip) {
    reviewer
    reviewId
    conductorId
    reviewScore
    timestamp
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
            reactionUri
        }
        count
    }
  }
}
`;

export const getReviewerReviews = async (
  wallet: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(REVIEWS),
    variables: {
      wallet,
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




const REVIEWER_PAGE = `
query($wallet: String!) {
  reviewers(where: {wallet: $wallet}) {
    wallet
    uri
    reviewCount
    totalScore
    averageScore
    lastReviewTimestamp
    metadata {
      title
      description
      image
    }
    reviews {
    reviewId
    conductorId
    conductor {
      uri
      metadata {
        image 
        title
      }
    }
    reviewScore
    timestamp
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
            reactionUri
        }
        count
    }
    } 
  }
}
`;

export const getReviewerPage = async (wallet: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(REVIEWER_PAGE),
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
