import DesignerEntry from "@/app/components/Designer/modules/DesignerEntry";
import { getDictionary } from "../../dictionaries";
import { tParams } from "@/app/layout";

export default async function Designer({ params }: { params: tParams}) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <DesignerEntry dict={dict} />;
}
