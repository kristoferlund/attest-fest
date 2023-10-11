import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox } from "@headlessui/react";
import { shortenEthAddress } from "../eth/util/shortenEthAddress";
import { useSafe } from "../safe/hooks/useSafe";
import { useAccount } from "wagmi";

type WalletSelectProps = {
  onChange: (address: string) => void;
  selectedSafeAddress?: string;
};

export function SafeSelect({
  selectedSafeAddress,
  onChange,
}: WalletSelectProps) {
  const { safes } = useSafe();
  const { address } = useAccount();

  if (!safes) {
    return null;
  }

  const selectedAddressInSafes = safes.includes(selectedSafeAddress || "");

  return (
    <div className="relative">
      <Listbox value={selectedSafeAddress} onChange={onChange}>
        <Listbox.Button className="w-full p-2 text-left bg-opacity-50 cursor-pointer bg-theme2 hover:bg-opacity-100">
          <div className="flex w-full">
            <div className="w-56 overflow-clip overflow-ellipsis md:w-96">
              {selectedAddressInSafes ? selectedSafeAddress : "-"}
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="pl-2" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute left-0 z-10 border bg-theme2 top-10 rounded-xl">
          <Listbox.Option
            key={address}
            value={address}
            className="flex items-center justify-between px-3 py-1 m-2 rounded-md cursor-pointer w-60 ui-active:bg-theme3 ui-active:text-theme1 whitespace-nowrap "
          >
            <img src="/ethereum.png" className="h-4 ml-1 mr-1" alt="Ethereum" />
            {shortenEthAddress(address)}
            <FontAwesomeIcon
              icon={faCheck}
              className="hidden ui-selected:inline-block"
            />
            <div className="inline-block w-4 ui-selected:hidden" />
          </Listbox.Option>
          <div className="border-b-2 border-theme4" />
          {safes.map((safe) => (
            <Listbox.Option
              key={safe}
              value={safe}
              className="flex items-center justify-between px-3 py-1 m-2 rounded-md cursor-pointer w-60 ui-active:bg-theme3 ui-active:text-theme1 whitespace-nowrap"
            >
              <img src="/safe.png" className="h-4 mr-1" alt="Ethereum" />
              {shortenEthAddress(safe)}
              <FontAwesomeIcon
                icon={faCheck}
                className="hidden w-4 ui-selected:inline-block"
              />
              <div className="inline-block w-4 ui-selected:hidden" />
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
