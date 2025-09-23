"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import { Success } from "./Success";
import { Error } from "./Error";

export default function ModalsEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  return (
    <>
      {context?.successData && <Success dict={dict} />}
      {context?.errorData && <Error dict={dict} />}
    </>
  );
}
