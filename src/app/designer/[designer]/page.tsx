import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import DesignerEntry from "@/app/components/Designer/modules/DesignerEntry";
import { Suspense } from "react";


export default async function Designer() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <DesignerEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
