export type Language = 'javascript' | 'python';
export type RunStatus = 'completed' | 'error' | 'output-limit' | 'timeout' |
'stopped' | 'unavailable' | 'source-limit' | 'input-limit';
export interface RunResult { status: RunStatus; output: string }
export const SOURCE_LIMIT = 32768;
export const INPUT_LIMIT = 8192;
export const OUTPUT_LIMIT = 16384;

export function inputLimit (source: string, input: string): RunStatus | null {
  const encoder = new TextEncoder();
  if (encoder.encode(source).length > SOURCE_LIMIT) return 'source-limit';
  if (encoder.encode(input).length > INPUT_LIMIT) return 'input-limit';
  return null;
}

export function parseResult (data: unknown): RunResult | null {
  if (!data || typeof data !== 'object') return null;
  const packet = data as Record<string, unknown>;
  const terminal = typeof packet.status === 'string' &&
    ['completed', 'error', 'output-limit'].includes(packet.status);
  if (packet.type !== 'result' || !terminal ||
    typeof packet.output !== 'string' || packet.output.length > OUTPUT_LIMIT ||
    packet.output.split('\n').length > 201 ||
    new TextEncoder().encode(packet.output).length > OUTPUT_LIMIT) return null;
  return { status: packet.status as RunStatus, output: packet.output, };
}
