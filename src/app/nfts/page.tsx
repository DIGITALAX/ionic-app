import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import NFTsEntry from "../components/NFTs/modules/NFTsEntry";

export default async function NFTs() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <NFTsEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
