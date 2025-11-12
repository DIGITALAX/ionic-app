import { useEffect, useState } from "react";
import { Designer } from "../../Common/types/common.types";
import { getDesigner } from "@/app/lib/queries/subgraph/getDesigners";
import { ensureMetadata } from "@/app/lib/utils";

const useDesigner = (designerAddress: string | undefined) => {
  const [designerLoading, setDesignerLoading] = useState<boolean>(false);
  const [designer, setDesigner] = useState<Designer | undefined>();

  const getPageDesigner = async () => {
    if (!designerAddress) return;
    setDesignerLoading(true);
    try {
      const data = await getDesigner(designerAddress);
      const ensured = await ensureMetadata(data?.data?.designers?.[0]);
      setDesigner({
        ...ensured,
        invitedBy: await ensureMetadata(ensured?.invitedBy),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDesignerLoading(false);
  };

  useEffect(() => {
    if (designerAddress) {
      getPageDesigner();
    }
  }, [designerAddress]);

  return {
    designerLoading,
    designer,
  };
};

export default useDesigner;
