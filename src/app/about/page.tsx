import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import AboutEntry from "../components/About/modules/AboutEntry";

export default async function About() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <AboutEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
