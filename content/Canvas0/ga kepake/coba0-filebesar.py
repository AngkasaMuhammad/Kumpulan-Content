import bpy
import os
import struct
import threading
import time

#COBA file BESARRRRRRRRRRRRRRRR

p = struct.pack
src = b''
for a in range(0x11111): #
	src += p('f',.01,)

def thrupd():
	global src
	bfp = bpy.data.filepath
	if bfp:
		dir = os.path.dirname(bfp)
		fp = os.path.join(dir, 'cobafileBESAR.bin',)
		with open(fp, 'wb') as file:
			vec = bpy.data.objects['Cube'].matrix_world.translation
			
			file.write(src)
			
			updlist.append(upd)
			te = bpy.data.texts['lihat']
			te.write('sudahhh\n')
			
def upd(scene,depsgraph,):
	updlist.clear()
	threading.Thread(target=thrupd).start()

updlist = bpy.app.handlers.depsgraph_update_post
updlist.clear()
updlist.append(upd)