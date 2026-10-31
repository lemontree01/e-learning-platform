import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion } from 'motion/react';
import { ACESFilmicToneMapping, type OrthographicCamera } from 'three';
import { createLighting, createSculpture, DEFAULT_ROTATION } from './scene';
import { DEFAULT_PARAMETERS, type Parameter } from '../model/ribbon';
import { type SculptureRendererProps } from './types';

function Scene (props: SculptureRendererProps) {
  const { parameters, rotation, wireframe, reducedMotion, active, onReady, onUnavailable, } = props;
  const sculpture = useMemo(createSculpture, []);
  const lighting = useMemo(createLighting, []);
  const current = useRef({ ...DEFAULT_PARAMETERS, });
  const ready = useRef(false);
  const { invalidate, camera, size, gl, scene, } = useThree();

  useEffect(() => {
    scene.add(sculpture.group, lighting);
    return () => { scene.remove(sculpture.group, lighting); sculpture.dispose(); };
  }, [scene, sculpture, lighting]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onUnavailable(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => { canvas.removeEventListener('webglcontextlost', lost); };
  }, [gl, onUnavailable]);
  useEffect(() => {
    const orthographic = camera as OrthographicCamera;
    orthographic.zoom = Math.min(size.width / 5.4, size.height / 4.2);
    orthographic.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  useEffect(() => {
    sculpture.mode(wireframe);
    if (active) invalidate();
  }, [parameters, rotation, wireframe, active, reducedMotion, sculpture, invalidate]);

  useFrame((_, delta) => {
    if (!active) return;
    let moving = false;
    let geometryChanged = false;
    const blend = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 14);
    for (const key of Object.keys(parameters) as Parameter[]) {
      const difference = parameters[key] - current.current[key];
      if (difference !== 0) {
        geometryChanged = true;
        current.current[key] = Math.abs(difference) < 0.001 || reducedMotion
          ? parameters[key]
          : current.current[key] + difference * blend;
        moving ||= current.current[key] !== parameters[key];
      }
    }
    if (geometryChanged) sculpture.update(current.current);
    for (const axis of ['x', 'y'] as const) {
      const target = DEFAULT_ROTATION[axis] + rotation[axis];
      const difference = target - sculpture.group.rotation[axis];
      sculpture.group.rotation[axis] = Math.abs(difference) < 0.001 || reducedMotion
        ? target
        : sculpture.group.rotation[axis] + difference * blend;
      moving ||= sculpture.group.rotation[axis] !== target;
    }
    if (!ready.current) { ready.current = true; onReady(); }
    if (moving) invalidate();
  });
  return null;
}

export default function SculptureRenderer (props: SculptureRendererProps) {
  return (
    <motion.div style={{ width: '100%', height: '100%', }} initial={false}
      animate={{ opacity: props.ready ? 1 : 0, y: props.ready || props.reducedMotion ? 0 : 8, }}
      transition={{ duration: props.reducedMotion ? 0 : 0.35, }}>
    <Canvas orthographic camera={{ position: [0, 0, 7], near: 0.1, far: 20, }}
      frameloop={props.active ? 'demand' : 'never'} dpr={props.mobile ? 1 : [1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}>
      <Scene {...props} />
    </Canvas>
    </motion.div>
  );
}
