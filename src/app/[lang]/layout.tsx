import Header from "../components/Common/modules/Header";
import Modals from "../components/Modals/modules/Modals";

export type tParams = Promise<{ lang: string }>;

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <div className="relative w-full min-h-screen flex flex-col gap-6">
      <Header params={params} />
      <div className="relative w-full h-full flex flex-col gap-3 px-2 py-2 pb-6">
        {children}
      </div>
      <Modals params={params} />
    </div>
  );
}
