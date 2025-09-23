import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";
import AboutEntry from "@/app/components/About/modules/AboutEntry";

export default async function About({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <AboutEntry dict={dict} />;
}
