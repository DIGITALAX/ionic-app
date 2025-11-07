import Image from "next/image";
import { JSX } from "react";

export const Border = ({
  children,
  className = "",
}: {
  children: JSX.Element;
  className: string;
}) => {
  return (
    <div className={`fancy-border-white ${className}`}>
      <div className={`absolute hover:rotate-45 z-20`} style={{ top: "-8px", left: "-8px" }}>
        <Image
          draggable={false}
          src={"/images/cathead.png"}
          alt="Cat Head"
          width={28}
          height={28}
        />
      </div>

      <div className={`absolute hover:rotate-45 z-20`} style={{ top: "-8px", right: "-8px" }}>
        <Image
          draggable={false}
          src={"/images/cathead.png"}
          alt="Cat Head"
          width={28}
          height={28}
        />
      </div>

      <div className={`absolute hover:rotate-45 z-20`} style={{ bottom: "-8px", left: "-8px" }}>
        <Image
          draggable={false}
          src={"/images/cathead.png"}
          alt="Cat Head"
          width={28}
          height={28}
        />
      </div>

      <div
        className={`absolute hover:rotate-45 z-20`}
        style={{ bottom: "-8px", right: "-8px" }}
      >
        <Image
          draggable={false}
          src={"/images/cathead.png"}
          alt="Cat Head"
          width={28}
          height={28}
        />
      </div>

      {children}
    </div>
  );
};
