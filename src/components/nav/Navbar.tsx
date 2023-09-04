import { Address } from "./Address";
import { Chain } from "./Chain";

export function Navbar() {
  return (
    <div className="absolute flex flex-col justify-between w-full gap-3 p-5 md:flex-row">
      <div className="flex items-center px-3 text-white bg-theme-accent">
        Attest Fest!
      </div>
      <div className="flex gap-3 md:flex-row">
        <Chain />
        <Address />
      </div>
    </div>
  );
}
