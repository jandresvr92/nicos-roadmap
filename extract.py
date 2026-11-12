"""Recorta el personaje (y > Y0, radio < R0) del diorama GLB y escribe un GLB ligero."""
import json,struct,numpy as np,io,sys
from PIL import Image
src,dst,Y0,R0,TEX=sys.argv[1],sys.argv[2],float(sys.argv[3]),float(sys.argv[4]),int(sys.argv[5])
d=open(src,'rb').read()
L=struct.unpack('<I',d[12:16])[0]; j=json.loads(d[20:20+L]); bin0=20+L+8
def acc(i):
    a=j['accessors'][i]; bv=j['bufferViews'][a['bufferView']]
    n={'SCALAR':1,'VEC2':2,'VEC3':3}[a['type']]; dt={5126:np.float32,5125:np.uint32,5123:np.uint16}[a['componentType']]
    off=bin0+bv.get('byteOffset',0)+a.get('byteOffset',0)
    return np.frombuffer(d,dt,a['count']*n,off).reshape(-1,n)
pr=j['meshes'][0]['primitives'][0]
P=acc(pr['attributes']['POSITION']); N=acc(pr['attributes']['NORMAL']); UV=acc(pr['attributes']['TEXCOORD_0'])
I=acc(pr['indices']).reshape(-1,3)
r=np.hypot(P[:,0],P[:,2])
# zona baja (pies): radio estrecho para descartar pasto/banderas; arriba: radio amplio (trofeo)
ok=(P[:,1]>Y0)&(r<np.where(P[:,1]<0.08,0.225,R0))
tri_ok=ok[I].all(1)
# descarta la cara superior plana del pedestal (normal hacia arriba, a la altura de los pies)
flat=(N[I][:,:,1].min(1)>0.9)&(P[I][:,:,1].max(1)<-0.045)
T=I[tri_ok&~flat]
used=np.unique(T); remap=np.full(len(P),-1,np.int64); remap[used]=np.arange(len(used))
P2,N2,UV2,T2=P[used].copy(),N[used].copy(),UV[used].copy(),remap[T].astype(np.uint32)
print('tris',len(T2),'verts',len(P2),'bbox',P2.min(0),P2.max(0),'uv',UV2.min(0),UV2.max(0))
def img(i,size,fmt):
    bv=j['bufferViews'][j['images'][i]['bufferView']]; o=bin0+bv.get('byteOffset',0)
    im=Image.open(io.BytesIO(d[o:o+bv['byteLength']])).convert('RGB').resize((size,size),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,'JPEG',quality=88,optimize=True); return b.getvalue()
blobs=[P2.tobytes(),N2.tobytes(),UV2.astype(np.float32).tobytes(),T2.tobytes(),img(0,TEX,'jpg'),img(2,TEX,'jpg')]
bvs=[];buf=b''
for k,bl in enumerate(blobs):
    while len(buf)%4: buf+=b'\0'
    v={'buffer':0,'byteOffset':len(buf),'byteLength':len(bl)}
    if k<3: v['target']=34962
    elif k==3: v['target']=34963
    bvs.append(v); buf+=bl
while len(buf)%4: buf+=b'\0'
g={'asset':{'version':'2.0','generator':'funko-extract'},'scene':0,'scenes':[{'nodes':[0]}],
 'nodes':[{'name':'FunkoAmigo','mesh':0}],
 'meshes':[{'name':'FunkoAmigo','primitives':[{'attributes':{'POSITION':0,'NORMAL':1,'TEXCOORD_0':2},'indices':3,'material':0}]}],
 'materials':[{'name':'Vinilo','pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':0.05,'roughnessFactor':0.85},
   'normalTexture':{'index':1},'doubleSided':True}],
 'textures':[{'source':0,'sampler':0},{'source':1,'sampler':0}],'samplers':[{'magFilter':9729,'minFilter':9987}],
 'images':[{'bufferView':4,'mimeType':'image/jpeg'},{'bufferView':5,'mimeType':'image/jpeg'}],
 'accessors':[
  {'bufferView':0,'componentType':5126,'count':len(P2),'type':'VEC3','min':P2.min(0).tolist(),'max':P2.max(0).tolist()},
  {'bufferView':1,'componentType':5126,'count':len(P2),'type':'VEC3'},
  {'bufferView':2,'componentType':5126,'count':len(P2),'type':'VEC2'},
  {'bufferView':3,'componentType':5125,'count':T2.size,'type':'SCALAR'}],
 'bufferViews':bvs,'buffers':[{'byteLength':len(buf)}]}
js=json.dumps(g).encode(); js+=b' '*((4-len(js)%4)%4)
out=struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(buf))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(buf),0x004E4942)+buf
open(dst,'wb').write(out); print('size MB',len(out)/1e6)
