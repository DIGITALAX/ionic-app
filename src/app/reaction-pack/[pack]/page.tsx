import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import ReactionPackEntry from "@/app/components/ReactionPack/modules/ReactionPackEntry";
import { Suspense } from "react";


export default async function ReactionPack() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <ReactionPackEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
