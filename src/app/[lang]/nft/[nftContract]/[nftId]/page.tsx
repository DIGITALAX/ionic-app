import { getDictionary } from "@/app/[lang]/dictionaries";
import NFTEntry from "@/app/components/NFT/modules/NFTEntry";
import { tParams } from "@/app/layout";

export default async function NFT({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <NFTEntry dict={dict} />;
}
