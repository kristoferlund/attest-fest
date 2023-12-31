import { AddressButton } from "./AddressButton";
import { Chain } from "./Chain";

export function Navbar() {
  return (
    <div className="absolute flex flex-col items-center w-full gap-3 p-5 md:justify-between md:flex-row">
      <div className="p-3 my-5 text-white md:my-0 bg-theme-accent">
        Attest Fest!
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <Chain />
        <AddressButton />
      </div>
    </div>
  );
}
