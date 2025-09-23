import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import ReviewerEntry from "@/app/components/Reviewer/modules/ReviewerEntry";
import { Suspense } from "react";



export default async function Reviewer() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <ReviewerEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
