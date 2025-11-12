import { getCurrentNetwork } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext } from "react";

export const Success = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.successData) return null;

  const network = getCurrentNetwork();
  const explorerUrl = context?.successData?.txHash
    ? `${network.blockExplorer}/tx/${context?.successData.txHash}`
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={context?.hideSuccess}
    >
      <div
        className="relative w-full sm:w-fit h-fit flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-80 h-96 flex font-rou cursor-default">
          <div className="stamp-border">
            <div className="stamp-content-wrapper overflow-y-scroll">
              <div className="stamp-grid-background"></div>
              <div className="stamp-content w-full flex flex-col text-black">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words my-2">
                  {context?.successData?.message}
                </p>

                {context?.successData?.txHash && (
                  <div className="w-full p-2 my-2">
                    <p className="text-xxs text-gray-600 mb-1">
                      {dict?.modals?.transactionHash}:
                    </p>
                    {explorerUrl ? (
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xxs text-blue-600 hover:text-blue-800 hover:underline break-all"
                      >
                        {context?.successData?.txHash}
                      </a>
                    ) : (
                      <p className="text-xxs text-blue-600 break-all">
                        {context?.successData?.txHash}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
