const canvas = document.getElementById("gl-canvas");
const gl = canvas.getContext("webgl");
const program = initShaders(gl, "vertex-shader", "fragment-shader");

gl.useProgram(program);gl.viewport(0,0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertices = generateGrid(1, 10);
const indices = generateIndices(10);

// Vertex buffer
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Index buffer
const ebo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Attribute setup
const positionLoc = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLoc);

gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);

function generateGrid(size, divisions) {
    const vertices = [];

    const step = size / divisions;

    for (let i = 0; i <= divisions; i++) {
        for (let j = 0; j <= divisions; j++) {
            const x = -size/2 + j * step;
            const z = -size/2 + i * step;
            vertices.push(x, z, 0);
        }
    }

    return new Float32Array(vertices);
}

function generateIndices(divisions) {
    const indices = [];

    for (let i = 0; i < divisions; i++) {
        for (let j = 0; j < divisions; j++) {
            let row1 = i * (divisions + 1);
            let row2 = (i + 1) * (divisions + 1);

            indices.push(row1 + j);
            indices.push(row2 + j);
            indices.push(row1 + j + 1);

            indices.push(row1 + j + 1);
            indices.push(row2 + j);
            indices.push(row2 + j + 1);
        }
    }

    return new Uint16Array(indices);
}

