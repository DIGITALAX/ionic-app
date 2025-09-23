import AccountEntry from "@/app/components/Account/modules/AccountEntry";
import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";

export default async function Account({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <AccountEntry dict={dict} />;
}
