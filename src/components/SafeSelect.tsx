import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox } from "@headlessui/react";
import { shortenEthAddress } from "../util/string";
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
    <div className="flex items-center">
      Safe account:
      <div className="relative">
        <Listbox value={selectedSafeAddress} onChange={onChange}>
          <Listbox.Button className="p-1 ml-1 cursor-pointer hover:bg-theme2">
            {selectedAddressInSafes
              ? shortenEthAddress(selectedSafeAddress)
              : "Select Wallet"}
            <FontAwesomeIcon icon={faChevronDown} className="pl-2" />
          </Listbox.Button>
          <Listbox.Options className="absolute left-0 p-2 border bg-theme2 top-8 rounded-xl">
            {safes.map((safe) => (
              <Listbox.Option
                key={safe}
                value={safe}
                className="flex items-center justify-between px-3 py-1 rounded-md w-52 ui-active:bg-theme3 ui-active:text-theme1 whitespace-nowrap"
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
    </div>
  );
}
