'use strict'

;{
	let canv2d = document.querySelector('#canv2d')
	let cx = canv2d.getContext('2d')
	let w = canv2d.width
	let h = canv2d.height
	let buka = document.querySelector('#buka')
	let file = null
	
	let pilih = async ()=>{
		;[file] = await showOpenFilePicker()
	}
	buka.addEventListener('click',pilih,)
	
	let render = async t=>{
		try{
			let pos
			if(file){
				let fileini = await file.getFile()
				let arr = await fileini.arrayBuffer()
				pos = new Float32Array(arr)
			}else{
				pos = [10,10,]
			}
			
			//kotak
			cx.fillStyle = '#005500ff'
			cx.fillRect(-11,-11,w+11,h+11,)
			cx.fillStyle = 'cyan'
			cx.fillRect(
				pos[0]*9-22,
				pos[1]*9-22,
				44,
				44,
			)
		}catch(e){
			console.log(e)
		}
		requestAnimationFrame(render)
	}
	render(0)
}