const canvas = document.getElementById("gl-canvas");
const gl = canvas.getContext("webgl");
const program = initShaders(gl, "vertex-shader", "fragment-shader");

gl.useProgram(program);gl.viewport(0,0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertices = generateGrid(1, 10);
const indices = generateIndices(10);

// vertex buffer
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// index buffer
const ebo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// attributes
const positionLoc = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLoc);

function generateGrid(size, divisions) { // generateGrid builds lattice structure of coords
    const vertices = [];

    const step = size / divisions;

    for (var i = 0; i <= divisions; i++) {
        for (var j = 0; j <= divisions; j++) {
            const x = -size/2 + j * step;
            const z = -size/2 + i * step;
            vertices.push(x, 0, z);
        }
    }

    return new Float32Array(vertices);
}

function generateIndices(divisions) { // generateIndices creates line-segments for lattice grid
    const indices = [];
    const stride = divisions + 1;

    // horizontal gridlines
    for (var i = 0; i <= divisions; i++) {
        for (var j = 0; j < divisions; j++) {
            const a = i * stride + j;
            const b = a + 1;
            indices.push(a, b);
        }
    }

    // verticals
    for (var j = 0; j <= divisions; j++) {
        for (var i = 0; i < divisions; i++) {
            const a = i * stride + j;
            const b = a + stride;
            indices.push(a, b);
        }
    }

    return new Uint16Array(indices);
}

