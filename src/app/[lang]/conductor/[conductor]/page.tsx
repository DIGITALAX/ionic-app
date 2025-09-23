import ConductorEntry from "@/app/components/Conductor/modules/ConductorEntry";
import { getDictionary } from "../../dictionaries";
import { tParams } from "@/app/layout";

export default async function Conductor({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <ConductorEntry dict={dict} />;
}
