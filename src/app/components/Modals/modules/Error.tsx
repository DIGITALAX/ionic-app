import { useContext } from "react";
import { ModalContext } from "@/app/providers";

export const Error = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.errorData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black max-w-md w-full">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 border border-black flex items-center justify-center">
                <span className="text-white text-sm font-bold">✕</span>
              </div>
              <h2 className="text-lg font-medium text-black">{dict?.modals?.error}</h2>
            </div>
            <button
              onClick={context.hideError}
              className="text-black hover:text-gray-600 transition-colors text-xl font-bold"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="text-black text-sm leading-relaxed whitespace-pre-wrap break-words">
              {context.errorData.message}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={context.hideError}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white border border-black transition-colors text-sm font-medium"
            >
              {dict?.modals?.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
