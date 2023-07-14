'use strict'

//
let glcanv = document.getElementsByTagName('canvas')[0]
let gl = glcanv.getContext('webgl2')
let vs_src = 
`#version 300 es
precision highp float;

in vec3 position;
in vec4 warna;

uniform view{
	mat4 persp;
	mat4 cam;
};

out vec4 warnahasil;

void main() {
	warnahasil = warna;
    gl_Position = persp*inverse(cam)*vec4(position,1.);
}
`
let fs_src = 
`#version 300 es
precision highp float;

in vec4 warnahasil;

out vec4 outColor;

void main() {
    outColor = warnahasil;
}
`

//
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
let prg = gl.createProgram();
let va = gl.createVertexArray();
let buffer = gl.createBuffer();

//
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
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
	-1,0,1,	0,0,0,1,
	1,0,1,	0,0,1,1,
	1,0,-1,	0,1,1,1,
	-1,0,-1,	1,1,1,1,
]), gl.STATIC_DRAW )

 //
gl.bindVertexArray(va)
//position
let positionLoc = gl.getAttribLocation(prg, 'position');
gl.enableVertexAttribArray(positionLoc)
gl.vertexAttribPointer(
	positionLoc	,
	3	,// 3 values per vertex shader iteration
	gl.FLOAT	,// data is 32bit floats
	false	,// don't normalize
	7*4	,// stride (0 = auto)
	0	,// offset into buffer
)
//warna
let warnaLoc = gl.getAttribLocation(prg, 'warna');
gl.enableVertexAttribArray(warnaLoc)
gl.vertexAttribPointer(
	warnaLoc	,
	4	,// 3 values per vertex shader iteration
	gl.FLOAT	,// data is 32bit floats
	false	,// don't normalize
	7*4	,// stride (0 = auto)
	3*4	,// offset into buffer
)
// element
let elebufsrc = new Uint16Array([
	0,1,3, 1,2,3,
])
let elebuf = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,elebuf,)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,elebufsrc,gl.STATIC_DRAW,)

//Move View
let m4 = glMatrix.mat4
let viewbufsrc = new Float32Array([
	...m4.create(),
	...m4.create(),
])
let persp	= new Float32Array(viewbufsrc.buffer,0*viewbufsrc.BYTES_PER_ELEMENT,16,)
let cam	= new Float32Array(viewbufsrc.buffer,16*viewbufsrc.BYTES_PER_ELEMENT,16,)

m4.perspective(
	persp	,
	.7	,//Field of View
	glcanv.width/glcanv.height	,//aspect ratio
	.1	,//z near
	33	, //z far
)

let viewbuf = gl.createBuffer()
gl.bindBuffer(gl.UNIFORM_BUFFER,viewbuf,)
gl.bufferData(gl.UNIFORM_BUFFER,viewbufsrc,gl.STATIC_DRAW,)

let viewLoc = gl.getUniformBlockIndex(prg,'view',)
gl.uniformBlockBinding(
	prg	,//program
	viewLoc	,//index di dalama program
	viewLoc	,//index yang menunjuk ke Uniform Buffer Binding
)
gl.bindBufferBase(
	gl.UNIFORM_BUFFER	,//
	viewLoc	,//index yang menunjuk ke Uniform Buffer Binding
	viewbuf	,//buffer
)

//
gl.useProgram(prg)

let geleng = 0
let angguk = 0
addEventListener('pointermove',e=>{
	/*
	m4.translate(cam,cam,[
		e.movementX/55	,
		0	,
		e.movementY/55	,
	],)
	*/
	geleng -= e.movementX/55
	angguk -= e.movementY/55
	
	angguk = Math.max(Math.min(angguk,Math.PI/2,),-Math.PI/2,)
	
	m4.identity(cam)
	m4.rotateY(cam,cam,geleng,)
	m4.rotateX(cam,cam,angguk,)
	m4.translate(cam,cam,[0,0,4,],)
	
	gl.bindBuffer(gl.UNIFORM_BUFFER,viewbuf,)
	gl.bufferSubData(
		gl.UNIFORM_BUFFER	,//
		16*viewbufsrc.BYTES_PER_ELEMENT	,//dstByteOffset
		viewbufsrc	,//srcData
		16	,//srcOffset
		cam.length	,//length
	)
	gl.drawElements(
		gl.TRIANGLES	,//mode
		elebufsrc.length	,//vertex count
		gl.UNSIGNED_SHORT	,//type
		0	,//offset
	)
})
