import {
  faCheck,
  faCircleNotch,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox } from "@headlessui/react";
import { isChainIdSupported } from "../wagmi/isChainIdSupported";
import { supportedChains } from "../wagmi/wagmi.config";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useStateStore } from "../zustand/hooks/useStateStore";

export function Chain() {
  const { chain } = useNetwork();
  const { error, isLoading, switchNetwork } = useSwitchNetwork();

  // Clear selected safe on chain switch
  function clearSelectedSafe() {
    if (!isLoading) return;
    useStateStore.setState({ selectedSafeAddress: "" });
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
        <FontAwesomeIcon icon={faCircleNotch} spin />
      </div>
    );
  }

  return (
    <div className="relative">
      <Listbox value={chain.id} onChange={(c) => switchNetwork?.(c)}>
        <Listbox.Button className="px-5 py-3 border cursor-pointer rounded-xl hover:bg-theme2">
          {isChainIdSupported(chain.id) ? (
            chain.name
          ) : (
            <div>
              <FontAwesomeIcon icon={faWaveSquare} className="mr-1" />
              Unsupported Network
            </div>
          )}
        </Listbox.Button>
        <Listbox.Options className="absolute left-0 p-2 border top-14 rounded-xl">
          {supportedChains.map((chain) => (
            <Listbox.Option
              key={chain.id}
              value={chain.id}
              className="flex items-center justify-between px-3 py-1 rounded-md w-44 ui-active:bg-theme3 ui-active:text-theme1 whitespace-nowrap"
            >
              {chain.name}
              <FontAwesomeIcon
                icon={faCheck}
                className="hidden ui-selected:inline-block"
              />
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
