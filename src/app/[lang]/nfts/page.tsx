import NFTsEntry from "@/app/components/NFTs/modules/NFTsEntry";
import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";

export default async function NFTs({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <NFTsEntry dict={dict} />;
}
