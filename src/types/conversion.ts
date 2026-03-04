import { ConversionOptions } from './formats';

export type ConversionState =
  | 'idle'
  | 'file-selected'
  | 'format-selected'
  | 'converting'
  | 'completed'
  | 'error';

export interface ConversionJob {
  id: string;
  file: File;
  inputFormat: string;
  outputFormat: string;
  options: ConversionOptions;
  state: ConversionState;
  progress: number;
  error?: string;
  resultUrl?: string;
  resultFilename?: string;
  resultSize?: number;
}
