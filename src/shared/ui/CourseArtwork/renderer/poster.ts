import { COURSE_ICONS } from '../courseIcons';
import { createIcon, createStage, REST_POSE } from './iconScene';

// Offline only (scripts/render-course-art.cjs): the image shown before, or instead of, live icons.
const { renderer, scene, camera, } = createStage({ preserveDrawingBuffer: true, });
renderer.setSize(960, 576);
document.body.appendChild(renderer.domElement);

Object.assign(window, {
  courseCount: COURSE_ICONS.length,
  renderCourse (id: number) {
    const icon = createIcon(id);
    icon.rotation.set(REST_POSE.pitch, REST_POSE.yaw, 0);
    scene.add(icon);
    renderer.render(scene, camera);
    scene.remove(icon);
  },
});
document.body.dataset.ready = 'true';
