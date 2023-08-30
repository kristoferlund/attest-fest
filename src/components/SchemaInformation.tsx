import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useEas } from "../eas/hooks/useEas";

export function SchemaInformation() {
  const { schemaRecordIsLoading, schemaRecordError, schemaError } = useEas();

  return (
    <>
      {schemaRecordIsLoading && (
        <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
      )}

      {schemaRecordError && (
        <div className="p-5 text-center text-white bg-red-500">
          {schemaRecordError.message}
        </div>
      )}

      {schemaError && (
        <div className="p-5 text-center text-white bg-red-500">
          Attestation schemas using arrays are not yet supported.{" "}
          {schemaError.message}
        </div>
      )}
    </>
  );
}
