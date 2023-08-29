import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox } from "@headlessui/react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { shortenEthAddress } from "../../util/string";
import { useSafe } from "../hooks/useSafe";

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
    <div className="relative w-44">
      <Listbox value={selectedSafeAddress} onChange={onChange}>
        <Listbox.Button className="px-5 py-3 border rounded-full cursor-pointer w-44 hover:bg-gray-100">
          {selectedAddressInSafes
            ? shortenEthAddress(selectedSafeAddress)
            : "Select Wallet"}
        </Listbox.Button>
        <Listbox.Options className="absolute p-2 border left-[-22px] top-16 rounded-xl">
          {safes.map((safe) => (
            <Listbox.Option
              key={safe}
              value={safe}
              className="flex items-center justify-between px-3 py-1 rounded-md w-44 ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black whitespace-nowrap"
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
