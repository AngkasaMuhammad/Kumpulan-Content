'use strict'

//Langkah 1
let gl = document.getElementsByTagName('canvas')[0].getContext('webgl2')
let vs_src = 
`#version 300 es
precision highp float;

in vec3 position;

void main() {
    gl_Position = vec4(position,1.);
}
`
let fs_src = 
`#version 300 es
precision highp float;

out vec4 outColor;

void main() {
    outColor = vec4(0., 1., 1., 1.);
}
`

//Langkah 2
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
let prg = gl.createProgram();
let va = gl.createVertexArray();
let positionBuffer = gl.createBuffer();

//Langkah 3
//link
//vertex shader
gl.shaderSource(vertexShader,vs_src,)
gl.compileShader(vertexShader)
console.log(
	'vertex info: ['+
	gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS,)+'] '+
	gl.getShaderInfoLog(vertexShader)
)
//fragment shader
gl.shaderSource(fragmentShader,fs_src,)
gl.compileShader(fragmentShader)
console.log(
	'fragment info: ['+
	gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS,)+'] '+
	gl.getShaderInfoLog(fragmentShader)
)
//link program
gl.attachShader(prg,vertexShader,)
gl.attachShader(prg,fragmentShader,)
gl.linkProgram(prg)
console.log(
	'program info: ['+
	gl.getProgramParameter(prg,gl.LINK_STATUS,)+'] '+
	gl.getProgramInfoLog(prg)
)
//buffer data
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	-1,0,0,
	.8,-.8,0,
	.4,.3,0,
]), gl.STATIC_DRAW)

 //Langkah 4
gl.bindVertexArray(va)
let positionLoc = gl.getAttribLocation(prg, 'position');
gl.enableVertexAttribArray(positionLoc)
gl.vertexAttribPointer(
	positionLoc	,
	3	,// 3 values per vertex shader iteration
	gl.FLOAT	,// data is 32bit floats
	false	,// don't normalize
	0	,// stride (0 = auto)
	0	,// offset into buffer
)

//Langkah 5
gl.useProgram(prg)
gl.drawArrays(gl.TRIANGLES, 0, 3);
