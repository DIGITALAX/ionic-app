import { useEffect, useState } from "react";
import { Designer } from "../../Common/types/common.types";
import { DUMMY_DESIGNER } from "@/app/lib/dummy";
import { getDesigner } from "@/app/lib/queries/subgraph/getDesigners";

const useDesigner = (designerAddress: string | undefined) => {
  const [designerLoading, setDesignerLoading] = useState<boolean>(false);
  const [designer, setDesigner] = useState<Designer | undefined>();

  const getPageDesigner = async () => {
    if (!designerAddress) return;
    setDesignerLoading(true);
    try {
      const data = await getDesigner(designerAddress);

      setDesigner(data?.data?.designers?.[0] ?? DUMMY_DESIGNER);
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
