import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import AccountEntry from "../components/Account/modules/AccountEntry";

export default async function Account() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<></>}>
          <AccountEntry dict={dict} />
        </Suspense>
      }
    />
  );
}
