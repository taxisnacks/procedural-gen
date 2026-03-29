const modelLoc = gl.getUniformLocation(program, "uModel");
const viewLoc  = gl.getUniformLocation(program, "uView");
const projLoc  = gl.getUniformLocation(program, "uProj");

let cameraPos = vec3(0.0, 0.0, 1.5);
let yaw = -90.0, pitch = 0.0;
let keys = {};

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup",   e => keys[e.key.toLowerCase()] = false);

let last = 0;
function render(ms) {
  const t = ms * 0.001;
  const dt = t - last;
  last = t;

  // build front from yaw/pitch (degrees -> radians)
  const yr = radians(yaw), pr = radians(pitch);
  let front = normalize(vec3(
    Math.cos(yr) * Math.cos(pr),
    Math.sin(pr),
    Math.sin(yr) * Math.cos(pr)
  ));

  let right = normalize(cross(front, vec3(0,1,0)));
  const speed = 1.5 * dt;
  if (keys["w"]) cameraPos = add(cameraPos, scale(speed, front));
  if (keys["s"]) cameraPos = subtract(cameraPos, scale(speed, front));
  if (keys["a"]) cameraPos = subtract(cameraPos, scale(speed, right));
  if (keys["d"]) cameraPos = add(cameraPos, scale(speed, right));

  const model = mat4();
  const view  = lookAt(cameraPos, add(cameraPos, front), vec3(0,1,0));
  const proj  = perspective(60, canvas.width/canvas.height, 0.01, 100.0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniformMatrix4fv(modelLoc, false, flatten(model));
  gl.uniformMatrix4fv(viewLoc,  false, flatten(view));
  gl.uniformMatrix4fv(projLoc,  false, flatten(proj));
  gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
