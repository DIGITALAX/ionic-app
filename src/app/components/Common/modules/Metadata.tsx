import Image from "next/image";
import { FunctionComponent, JSX } from "react";
import { NFTMetadata } from "../types/common.types";

const Metadata: FunctionComponent<{
  metadata: NFTMetadata;
}> = ({ metadata }): JSX.Element => {
  switch (metadata.type) {
    case "audio":
      return (
        <audio muted autoPlay loop draggable={false} className="object-cover">
          <source src={metadata.video} />
        </audio>
      );

    case "video":
      return (
        <video muted autoPlay loop draggable={false} className="object-cover">
          <source src={metadata.video} />
        </video>
      );

    case "text":
      return (
        <div className="relative max-h-40 overflow-y-scroll items-start justify-start text break-words text-black text-sm">
          {metadata.text}
        </div>
      );

    default:
      return (
        <Image
          src={metadata.image!}
          alt={metadata.title}
          fill
          draggable={false}
          className="object-cover"
        />
      );
  }
};

export default Metadata;
