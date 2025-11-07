import { getCurrentNetwork } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext } from "react";

export const Success = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.successData) return null;

  const network = getCurrentNetwork();
  const explorerUrl = context.successData.txHash
    ? `${network.blockExplorer}/tx/${context.successData.txHash}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black max-w-md w-full">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 border border-black flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <h2 className="text-lg text-black">{dict?.modals?.success}</h2>
            </div>
            <button
              onClick={context.hideSuccess}
              className="text-black hover:text-gray-600 transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-black text-sm leading-relaxed mb-4">
              {context.successData.message}
            </p>

            {context.successData.txHash && (
              <div className="bg-gray-50 border border-black p-3">
                <p className="text-sm text-black mb-2">{dict?.modals?.transactionHash}:</p>
                {explorerUrl ? (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 break-all underline transition-colors"
                  >
                    {context.successData.txHash}
                  </a>
                ) : (
                  <p className="text-xs text-gray-600 break-all">
                    {context.successData.txHash}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={context.hideSuccess}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white border border-black transition-colors text-sm"
            >
{dict?.modals?.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
