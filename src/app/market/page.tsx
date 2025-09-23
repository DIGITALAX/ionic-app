import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import MarketEntry from "../components/Market/modules/MarketEntry";

export default async function Market() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <MarketEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
