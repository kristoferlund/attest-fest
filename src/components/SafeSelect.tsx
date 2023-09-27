import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox } from "@headlessui/react";
import { shortenEthAddress } from "../eth/util/shortenEthAddress";
import { useSafe } from "../safe/hooks/useSafe";

type WalletSelectProps = {
  onChange: (address: string) => void;
  selectedSafeAddress?: string;
};

export function SafeSelect({
  selectedSafeAddress,
  onChange,
}: WalletSelectProps) {
  const { safes } = useSafe();

  if (!safes) {
    return null;
  }

  const selectedAddressInSafes = safes.includes(selectedSafeAddress || "");

  return (
    <div className="relative">
      <Listbox value={selectedSafeAddress} onChange={onChange}>
        <Listbox.Button className="w-full p-2 text-left bg-opacity-50 cursor-pointer bg-theme2 hover:bg-opacity-100">
          <div className="flex w-full">
            <div className="overflow-clip overflow-ellipsis w-96">
              {selectedAddressInSafes ? selectedSafeAddress : "-"}
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="pl-2" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute left-0 z-10 p-2 border bg-theme2 top-10 rounded-xl">
          {safes.map((safe) => (
            <Listbox.Option
              key={safe}
              value={safe}
              className="flex items-center justify-between px-3 py-1 rounded-md cursor-pointer w-52 ui-active:bg-theme3 ui-active:text-theme1 whitespace-nowrap"
            >
              {shortenEthAddress(safe)}
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
