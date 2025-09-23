import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import NFTEntry from "@/app/components/NFT/modules/NFTEntry";
import { Suspense } from "react";


export default async function NFT() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <NFTEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
