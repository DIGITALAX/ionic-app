import { gql } from "@apollo/client";
import { graphClient } from "../client";


const PURCHASES = `
query($buyer: String!, $first: Int!, $skip: Int!) {
  purchases(where: {buyer: $buyer}, first: $first, skip: $skip) {
    buyer
    purchaseId
    packId
    price
    editionNumber
    shareWeight
    timestamp
    transactionHash
    pack {
      packMetadata {
        title
        image
      }
    }
  }
}
`;

export const getPurchases = async (
  buyer: string,
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(PURCHASES),
    variables: {
      buyer,
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
