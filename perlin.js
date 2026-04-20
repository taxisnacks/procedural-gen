const terrain = {
  amp: 0.12,
  freq: 2.5,
  octaves: 4,
  lacunarity: 2.0,
  gain: 0.5,
  seed: 1337
};

function hash2(ix, iz) {
  let n = ix * 374761393 + iz * 668265263 + terrain.seed * 69069;
  n = (n ^ (n >> 13)) * 1274126177;
  n = n ^ (n >> 16);
  return (n >>> 0) / 4294967296;
}

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + (b - a) * t; }

function valueNoise2(x, z) {
  const x0 = Math.floor(x), z0 = Math.floor(z);
  const x1 = x0 + 1,        z1 = z0 + 1;
  const tx = x - x0, tz = z - z0;
  const u = fade(tx), v = fade(tz);

  const n00 = hash2(x0, z0), n10 = hash2(x1, z0);
  const n01 = hash2(x0, z1), n11 = hash2(x1, z1);

  return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v) * 2.0 - 1.0;
}

function fbm(x, z) {
  let sum = 0, amp = 1, freq = terrain.freq, norm = 0;
  for (let o = 0; o < terrain.octaves; o++) {
    sum += amp * valueNoise2(x * freq, z * freq);
    norm += amp;
    amp *= terrain.gain;
    freq *= terrain.lacunarity;
  }
  return sum / norm;
}

function heightFn(x, z, gridSize) {
  const nx = x / gridSize;
  const nz = z / gridSize;
  return terrain.amp * fbm(nx, nz);
}
