"use client";

import { FunctionComponent, JSX, useContext } from "react";
import { Border } from "./Border";

const Notice: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-96 p-5 bg-white text-black flex border-2 border-black">
        <div className="relative w-full h-full overflow-y-scroll">
          <div className="relative w-full h-fit flex text-center justify-start items-start font-mid">
            platforms farmed your taste for a decade, or two. every like, every
            share, every perfect find before anyone else found it. you made
            culture move. they made billions. you got hearts. little red
            validation. dopamine dressed as social capital while your curation
            trained their algorithms, your discoveries became their targeting
            data, your evaluation labor built their valuation. the entire
            economy of cool ran on your unpaid work. let's repeat that. let it
            sink in. media runs everything in the platform era. are we stuck
            here?
            <br />
            <br />
            watch, read, listen, wear, cringe, consume, repeat. ever stop to
            think: what happens if we reclaim the agency to produce? it breaks
            the artificial walls that make fashion seem like some separate
            exotic category. a garment pattern is media. a production right is
            media. once you see that, the evaluation framework becomes universal
            instead of niche. fashion itself - what we wear, anywhere - is
            media.
            <br />
            <br />
            that's the zeitgeist of now. the extraction models breaking, while
            you're left to scatter and scramble for decent replacements. if the
            old model's broken, how do you know what anything new might be
            worth? we build new systems to evaluate media in all of its forms.
            <br/><br/>
            click around; podev3 is Ionic.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
