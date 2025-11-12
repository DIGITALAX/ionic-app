"use client";

import { FunctionComponent, JSX, useState } from "react";
import ConductorTab from "./ConductorTab";
import ReviewerTab from "./ReviewerTab";
import DesignerTab from "./DesignerTab";
import PurchasesTab from "./PurchasesTab";

const AccountEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("conductor");

  const tabs = [
    { id: "conductor", label: dict?.account?.tabs?.conductor },
    { id: "reviewer", label: dict?.account?.tabs?.reviewer },
    { id: "designer", label: dict?.account?.tabs?.designer },
    { id: "purchases", label: dict?.account?.tabs?.purchases },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-4xl h-[80vh]">
        <div className="stamp-border h-full">
          <div className="stamp-content-wrapper overflow-hidden h-full flex flex-col">
            <div className="stamp-grid-background"></div>
            <div className="w-full flex flex-col h-full">
              <div className="flex flex-wrap gap-0 border-b border-gray-300 flex-shrink-0 bg-white">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-3 text-xs font-girl transition-all duration-200 border-r border-gray-200 last:border-r-0 relative ${
                      activeTab === tab.id
                        ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white/80 overflow-y-auto flex-1">
                {activeTab === "conductor" && <ConductorTab dict={dict} />}
                {activeTab === "reviewer" && <ReviewerTab dict={dict} />}
                {activeTab === "designer" && <DesignerTab dict={dict} />}
                {activeTab === "purchases" && <PurchasesTab dict={dict} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountEntry;
