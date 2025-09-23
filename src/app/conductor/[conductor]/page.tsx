import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import ConductorEntry from "@/app/components/Conductor/modules/ConductorEntry";
import { Suspense } from "react";


export default async function Conductor() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <ConductorEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
