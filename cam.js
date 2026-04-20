const modelLoc = gl.getUniformLocation(program, "uModel");
const viewLoc  = gl.getUniformLocation(program, "uView");
const projLoc  = gl.getUniformLocation(program, "uProj");

var cameraPos = vec3(0.0, 1.2, 2.2);
var yaw = -90.0, pitch = -25.0;
var keys = {};
const sensitivity = 0.12; 
var speed; // todo: implement a shift to increase cam speed button
var hasEdit = false; // flag for changing mesh in realtime


// WASD camera movement
window.addEventListener("keydown", (e) => { keys[e.code] = true; });
window.addEventListener("keyup",   (e) => { keys[e.code] = false; });
canvas.addEventListener("click", () => canvas.requestPointerLock());

// mouse camera panning
canvas.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement !== canvas) return;

  yaw   += e.movementX * sensitivity;
  pitch -= e.movementY * sensitivity;

// prevents weird flipping
  pitch = Math.max(-89.0, Math.min(89.0, pitch));
});

var last = 0;
let fpsAccum = 0, fpsFrames = 0, fps = 0;

function render(ms) {
  const t = ms * 0.001;
  const dt = t - last;
  last = t;

  const yr = radians(yaw), pr = radians(pitch);
  var front = normalize(vec3(
    Math.cos(yr) * Math.cos(pr),
    Math.sin(pr),
    Math.sin(yr) * Math.cos(pr)
  ));
  var right = normalize(cross(front, vec3(0,1,0)));

  const moveSpeed = 1.5 * dt;

  // movement
  if (keys["KeyW"]) cameraPos = add(cameraPos, scale(moveSpeed, front));
  if (keys["KeyS"]) cameraPos = subtract(cameraPos, scale(moveSpeed, front));
  if (keys["KeyA"]) cameraPos = subtract(cameraPos, scale(moveSpeed, right));
  if (keys["KeyD"]) cameraPos = add(cameraPos, scale(moveSpeed, right));

  // terrain edits
  if (keys["BracketLeft"])  { terrain.amp  = Math.max(0.0, terrain.amp - 0.2 * dt); hasEdit = true; }
  if (keys["BracketRight"]) { terrain.amp  = Math.min(1.0, terrain.amp + 0.2 * dt); hasEdit = true; }
  if (keys["Minus"])        { terrain.freq = Math.max(0.1, terrain.freq - 2.0 * dt); hasEdit = true; }
  if (keys["Equal"])        { terrain.freq = Math.min(40.0, terrain.freq + 2.0 * dt); hasEdit = true; }
  if (hasEdit) rebuildTerrain();

  const model = mat4();
  const view  = lookAt(cameraPos, add(cameraPos, front), vec3(0,1,0));
  const proj  = perspective(60, canvas.width/canvas.height, 0.01, 100.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniformMatrix4fv(modelLoc, false, flatten(model));
  gl.uniformMatrix4fv(viewLoc, false, flatten(view));
  gl.uniformMatrix4fv(projLoc, false, flatten(proj));
  gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

  fpsAccum += dt; fpsFrames++;
  if (fpsAccum >= 0.25) {
    fps = fpsFrames / fpsAccum;
    fpsAccum = 0; fpsFrames = 0;
    // optional: console.log("fps", fps.toFixed(1));
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
