import ReactionPackEntry from "@/app/components/ReactionPack/modules/ReactionPackEntry";
import { getDictionary } from "../../dictionaries";
import { tParams } from "@/app/layout";

export default async function ReactionPack({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <ReactionPackEntry dict={dict} />;
}
