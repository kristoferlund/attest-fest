import { BackgroundImages } from "./components/BackgroundImages";
import { Cert } from "./components/cert";
import { Check } from "./components/Check";
import { CsvEditView } from "./views/CsvEditView";
import { Dots } from "./components/Dots";
import { EasContextProvider } from "./eas/components/EasContextProvider";
import { Eyes } from "./components/Eyes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hat } from "./components/Hat";
import { Lines } from "./components/Lines";
import { Navbar } from "./nav/Navbar";
import PartyHat from "./components/PartyHat";
import { Pop } from "./components/Pop";
import { SafeContextProvider } from "./safe/components/SafeContextProvider";
import { SafeInformation } from "./safe/components/SafeInformation";
import { SafeSelect } from "./safe/components/SafeSelect";
import { SchemaInformation } from "./eas/components/SchemaInformation";
import { SchemaInput } from "./eas/components/SchemaInput";
import { Thumb } from "./components/Thumb";
import { Toaster } from "react-hot-toast";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useNetwork } from "wagmi";
import { useSafe } from "./safe/hooks/useSafe";
import { useStateStore } from "./zustand/hooks/useStateStore";
function AppInner() {
  //Hooks
  const { safes, owners } = useSafe();

  // Global state
  const selectedSafeAddress = useStateStore(
    (state) => state.selectedSafeAddress
  );
  const schemaUid = useStateStore((state) => state.schemaUid);

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
              {selectedSafeAddress && owners?.length > 0 && (
                <>
                  <SafeInformation />
                  <SchemaInput
                    value={schemaUid}
                    onChange={(schemaUid) =>
                      useStateStore.setState({ schemaUid })
                    }
                  />
                </>
              )}

              {schemaUid && (
                <EasContextProvider schemaUid={schemaUid}>
                  <SchemaInformation />
                  <CsvEditView />
                </EasContextProvider>
              )}
            </>
          ) : (
            <p className="text-center">
              The connected wallet is not owner of any safes. Connect with
              another wallet or create a safe at{" "}
              <a href="https://safe.global/" target="_blank">
                safe.global
              </a>
            </p>
          )}
        </>
      ) : (
        <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
      )}
    </>
  );
}

const images = [
  <Cert />,
  <Check />,
  <Dots />,
  <Eyes />,
  <Hat />,
  <Lines />,
  <PartyHat />,
  <Pop />,
  <Thumb />,
  <Hat />,
  <Dots />,
  <Cert />,
  <Cert />,
  <Check />,
  <Dots />,
  <Eyes />,
  <Cert />,
  <Check />,
  <Dots />,
  <Eyes />,
  <Hat />,
  <Lines />,
  <PartyHat />,
  <Pop />,
  <Thumb />,
  <Hat />,
  <Dots />,
  <Cert />,
  <Cert />,
  <Check />,
  <Dots />,
  <Eyes />,
  <Hat />,
  <Lines />,
  <PartyHat />,
  <Pop />,
  <Thumb />,
  <Hat />,
  <Dots />,
  <Cert />,
];
const minSize = 2; // Minimum size in percentage
const maxSize = 10; // Maximum size in percentage

function App() {
  const { chain } = useNetwork();

  // Global state
  const selectedSafeAddress = useStateStore(
    (state) => state.selectedSafeAddress
  );

  return (
    <div>
      <div className="absolute top-0 left-0 w-screen h-screen -z-10">
        <BackgroundImages images={images} minSize={minSize} maxSize={maxSize} />
      </div>
      <Navbar />
      <div className="pt-36 md:pt-24 w-full md:w-[768px]">
        <div className="flex flex-col items-center justify-center gap-5 p-5">
          <div className="">Attest Fest</div>
          <div className="text-center">Create many attestations at a time.</div>
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
