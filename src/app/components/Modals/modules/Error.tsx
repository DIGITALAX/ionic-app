import { useContext } from "react";
import { ModalContext } from "@/app/providers";

export const Error = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.errorData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 cursor-pointer" onClick={context.hideError}>
      <div className="relative w-full sm:w-fit h-fit flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-80 h-96 flex font-rou cursor-default">
          <div className="stamp-border">
            <div className="stamp-content-wrapper overflow-y-scroll">
              <div className="stamp-grid-background"></div>
              <div className="stamp-content w-full flex flex-col text-black">
                <p className="stamp-message">{context.errorData.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
