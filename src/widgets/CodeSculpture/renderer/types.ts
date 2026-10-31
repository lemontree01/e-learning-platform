import { type RibbonParameters } from '../model/ribbon';

export interface SculptureRendererProps {
  parameters: RibbonParameters;
  rotation: { x: number; y: number };
  wireframe: boolean;
  active: boolean;
  ready: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}
