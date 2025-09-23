import ReviewerEntry from "@/app/components/Reviewer/modules/ReviewerEntry";
import { getDictionary } from "../../dictionaries";
import { tParams } from "@/app/layout";

export default async function Reviewer({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <ReviewerEntry dict={dict} />;
}
