import Notice from "@/app/components/Common/modules/Notice";
import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";

export default async function About({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Notice dict={dict} />;
}
