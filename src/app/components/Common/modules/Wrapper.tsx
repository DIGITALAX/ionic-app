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
    <>
      <div className="relative w-full h-fit min-h-screen flex flex-col gap-3 p-2">
        <HeaderEntry dict={dict} />
        {page}
      </div>

      <ModalsEntry dict={dict} />
    </>
  );
}
