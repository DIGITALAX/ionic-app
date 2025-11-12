import { JSX } from "react";
import ModalsEntry from "../../Modals/modules/ModalsEntry";
import HeaderEntry from "./HeaderEntry";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <div className="relative w-full min-h-screen flex flex-col gap-6">
      <HeaderEntry dict={dict} />
      <div className="relative w-full h-full flex flex-col gap-3 px-2 py-2 pb-6">
        {page}
      </div>
      <ModalsEntry dict={dict} />
    </div>
  );
}
