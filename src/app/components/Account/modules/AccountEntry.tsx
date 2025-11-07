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

  return (
    <div className="w-full max-w-5xl mx-auto p-3">
      <div className="border border-black mb-3">
        <div className="flex">
          <button
            onClick={() => setActiveTab("conductor")}
            className={`py-2 px-3 text-sm border-r border-black transition-colors ${
              activeTab === "conductor"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.account?.tabs?.conductor}
          </button>
          <button
            onClick={() => setActiveTab("reviewer")}
            className={`py-2 px-3 text-sm border-r border-black transition-colors ${
              activeTab === "reviewer"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.account?.tabs?.reviewer}
          </button>
          <button
            onClick={() => setActiveTab("designer")}
            className={`py-2 px-3 text-sm border-r border-black transition-colors ${
              activeTab === "designer"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.account?.tabs?.designer}
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`py-2 px-3 text-sm transition-colors ${
              activeTab === "purchases"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-50"
            }`}
          >
            {dict?.account?.tabs?.purchases}
          </button>
        </div>
      </div>

      {activeTab === "conductor" && <ConductorTab dict={dict} />}
      {activeTab === "reviewer" && <ReviewerTab dict={dict} />}
      {activeTab === "designer" && <DesignerTab dict={dict} />}
      {activeTab === "purchases" && <PurchasesTab dict={dict} />}
    </div>
  );
};

export default AccountEntry;
