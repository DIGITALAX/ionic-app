import { Suspense } from "react";
import { getDictionary } from "./[lang]/dictionaries";
import Wrapper from "./components/Common/modules/Wrapper";
import Entry from "./components/Common/modules/Entry";

export default async function Home() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <Entry dict={dict} />
        </Suspense>
      }
    />
  );
}
