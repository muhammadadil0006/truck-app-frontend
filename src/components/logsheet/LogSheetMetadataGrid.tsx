import { LOG_SHEET_DEFAULTS } from "../../constants/logSheetDefaults";
import { PaperField } from "./PaperField";

/** Carrier/vehicle/driver header metadata — label-over-value pairs, not
 * run-on sentences. */
export function LogSheetMetadataGrid() {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-ink-200 pb-4 sm:grid-cols-4">
        <PaperField label="Carrier" value={LOG_SHEET_DEFAULTS.carrierName} />
        <PaperField label="Main office" value={LOG_SHEET_DEFAULTS.mainOfficeAddress} />
        <PaperField label="Shipping doc" value={LOG_SHEET_DEFAULTS.shippingDocNumber} />
        <PaperField label="Time zone" value={LOG_SHEET_DEFAULTS.homeTerminalTimeZone} />
        <PaperField label="Vehicle" value={LOG_SHEET_DEFAULTS.truckTrailerNumber} />
        <PaperField label="Driver" value={LOG_SHEET_DEFAULTS.driverName} />
        <PaperField label="Co-driver" value={LOG_SHEET_DEFAULTS.coDriverName || "None"} />
      </div>
      <p className="-mt-2 text-[10px] text-ink-400 italic">
        Driver certifies these entries are true and correct.
      </p>
    </>
  );
}
