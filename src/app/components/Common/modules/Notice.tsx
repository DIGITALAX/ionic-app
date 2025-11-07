"use client";

import { FunctionComponent, JSX, useContext } from "react";
import { Border } from "./Border";

const Notice: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Border className="relative w-80 h-96 p-5 bg-black/70 rounded-2xl flex">
        <div className="relative w-full h-full overflow-y-scroll">
          <div className="relative text-white w-full h-fit flex text-center justify-start items-start font-mid">
            {dict.notice.paragraph1}
            <br />
            <br />
            {dict.notice.paragraph2}
            <br />
            <br />
            {dict.notice.paragraph3}
            <br />
            <br />
            {dict.notice.paragraph4}
          </div>
        </div>
      </Border>
    </div>
  );
};

export default Notice;
