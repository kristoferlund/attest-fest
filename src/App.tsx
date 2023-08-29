import { CreateTransactionView } from "./views/CreateTransaction";
import { EasContextProvider } from "./eas/components/EasContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "./nav/Navbar";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SafeSelect } from "./safe/components/SafeSelect";
import { SchemaFormView } from "./views/SchemaForm";
import { SchemaInformation } from "./eas/components/SchemaInformation";
import { SchemaInput } from "./eas/components/SchemaInput";
import { Toaster } from "react-hot-toast";
import { Transaction } from "./views/Transaction";
import { Transition } from "@headlessui/react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useNetwork } from "wagmi";
import { useSafe } from "./safe/hooks/useSafe";
import { useStateStore } from "./zustand/hooks/useStateStore";

function AppInner() {
  //Hooks
  const { safes } = useSafe();

  // Global state
  const selectedSafeAddress = useStateStore(
    (state) => state.selectedSafeAddress
  );
  const schemaUid = useStateStore((state) => state.schemaUid);
  const csv = useStateStore((state) => state.csv);
  const csvError = useStateStore((state) => state.csvError);
  const showTransaction = useStateStore((state) => state.showTransaction);

  // CSV is valid if it is not undefined, does not start with a #, and has no errors
  const isCsvValid = typeof csv !== "undefined" && !csvError && csv[0] !== "#";

  const safeTxHash = window.location.pathname.split("/")[1];

  if (safeTxHash) {
    return <Transaction safeTxHash={safeTxHash} />;
  }

  return (
    <>
      {safes ? (
        <>
          {safes.length > 0 ? (
            <>
              <SafeSelect
                selectedSafeAddress={selectedSafeAddress}
                onChange={(address) =>
                  useStateStore.setState({ selectedSafeAddress: address })
                }
              />
              {selectedSafeAddress && (
                <SchemaInput
                  value={schemaUid}
                  onChange={(schemaUid) =>
                    useStateStore.setState({ schemaUid })
                  }
                />
              )}

              {schemaUid && (
                <EasContextProvider schemaUid={schemaUid}>
                  <Transition
                    show={!showTransaction}
                    enter="transition duration-300 ease-in"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition duration-300 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                    className="flex flex-col items-center justify-center gap-5"
                  >
                    <SchemaInformation />
                    <SchemaFormView />
                  </Transition>
                  <Transition
                    show={showTransaction && isCsvValid}
                    enter="transition duration-300 ease-in delay-300"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                  >
                    <CreateTransactionView />
                  </Transition>
                </EasContextProvider>
              )}
            </>
          ) : (
            <p>
              The connected wallet is not owner of any safes. Connect with
              another wallet or create a safe at{" "}
              <a href="https://safe.global/" target="_blank">
                safe.global
              </a>
            </p>
          )}
        </>
      ) : (
        <FontAwesomeIcon icon={faCircleNotch} spin />
      )}
    </>
  );
}

function App() {
  const { chain } = useNetwork();

  // Global state
  const selectedSafeAddress = useStateStore(
    (state) => state.selectedSafeAddress
  );

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center pt-24">
        <div className="flex flex-col items-center justify-center w-1/2 gap-5">
          {chain?.id && (
            <SafeContextProvider address={selectedSafeAddress}>
              <AppInner />
            </SafeContextProvider>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
