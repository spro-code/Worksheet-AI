/**
 * WorksheetCanvas — thin re-export shim.
 * WorksheetEditor imports this name; actual implementation lives in
 * builder/WorksheetBuilder so the AI sidebar layout is never touched.
 */
export { WorksheetBuilder as WorksheetCanvas } from './builder/WorksheetBuilder';
