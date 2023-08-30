import { Address } from "./Address";
import { Chain } from "./Chain";

export function Navbar() {
  return (
    <div className="absolute flex flex-col justify-end w-full gap-3 p-5 md:flex-row">
      <Chain />
      <Address />
    </div>
  );
}
