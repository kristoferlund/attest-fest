import {
  faCheck,
  faCircleNotch,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { ChainIcon } from "./ChainIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox } from "@headlessui/react";
import { isChainIdSupported } from "../../wagmi/isChainIdSupported";
import { supportedChains } from "../../wagmi/wagmi.config";
import toast from "react-hot-toast";
import { useStateStore } from "../../zustand/hooks/useStateStore";

const DEV_CHAINS = [
  "Sepolia",
  "Optimism Sepolia",
  "Scroll Sepolia",
  "Polygon Mumbai",
];

export function Chain() {
  const { chain } = useNetwork();
  const { error, isLoading, switchNetwork } = useSwitchNetwork();
  const [activeChain, setActiveChain] = useState<number>();

  // Reload on chain switch, not super elegant but it works to prevent an ETH revert error.
  useEffect(() => {
    if (activeChain && activeChain !== chain?.id) {
      window.location.reload();
    }
    setActiveChain(chain?.id);
  }, [activeChain, chain]);

  // Clear selected safe on chain switch
  function clearSelectedSafe() {
    if (!isLoading) return;
    useStateStore.setState({ selectedWalletAddress: "" });
  }
  useEffect(clearSelectedSafe, [isLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (!chain) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="px-5 py-3 border rounded-full">
        <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
      </div>
    );
  }

  const bg = isChainIdSupported(chain.id) ? "bg-theme1" : "bg-red-500";

  return (
    <div className="relative">
      <Listbox value={chain.id} onChange={(c) => switchNetwork?.(c)}>
        <Listbox.Button
          className={`w-full px-5 py-3 border cursor-pointer rounded-xl hover:bg-theme2 md:inline-block ${bg}`}
        >
          {isChainIdSupported(chain.id) ? (
            <ChainIcon chainName={chain.name} className="h-4" />
          ) : (
            <div>
              <FontAwesomeIcon icon={faWaveSquare} className="mr-1" />
              Unsupported Network
            </div>
          )}
        </Listbox.Button>
        <Listbox.Options className="absolute left-0 p-2 border top-14 rounded-xl bg-theme2">
          {supportedChains.map((chain) => (
            <Listbox.Option
              key={chain.id}
              value={chain.id}
              className="flex items-center justify-between w-64 px-3 py-1 rounded-md cursor-pointer ui-active:bg-theme3 ui-active:text-theme1 whitespace-nowrap"
            >
              <ChainIcon chainName={chain.name} className="h-4" />
              <div
                className={DEV_CHAINS.includes(chain.name) ? "opacity-50" : ""}
              >
                {chain.name}
                <FontAwesomeIcon
                  icon={faCheck}
                  className="hidden ml-2 ui-selected:inline-block"
                />
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
