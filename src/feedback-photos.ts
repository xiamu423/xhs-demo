export type FeedbackPhoto = {id:string;width:number;height:number};
export type PreparedPhoto = FeedbackPhoto & {blob:Blob;preview:string};
export const MAX_FEEDBACK_PHOTOS = 9;
const databaseName = new URLSearchParams(location.search).get('qa') === '1' ? 'xhs-qa-photos' : 'xhs-feedback-photos';

async function database():Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(databaseName,1);
    request.onupgradeneeded=()=>request.result.createObjectStore('photos');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('图片存储暂时不可用'));
  });
}

export async function saveFeedbackPhotos(photos:PreparedPhoto[]) {
  if(!photos.length)return;
  const db=await database();
  try {await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction('photos','readwrite');
    tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error||new Error('图片保存失败'));
    photos.forEach(photo=>tx.objectStore('photos').put(photo.blob,photo.id));
  });} finally {db.close();}
}

export async function readFeedbackPhoto(id:string):Promise<Blob|undefined> {
  const db=await database();
  try {return await new Promise((resolve,reject)=>{
    const tx=db.transaction('photos','readonly');
    const request=tx.objectStore('photos').get(id);
    tx.oncomplete=()=>resolve(request.result);tx.onabort=()=>reject(tx.error);
  });} finally {db.close();}
}

export async function deleteFeedbackPhotos(photos:FeedbackPhoto[]) {
  if(!photos.length)return;
  const db=await database();
  try {await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction('photos','readwrite');
    tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error);
    photos.forEach(photo=>tx.objectStore('photos').delete(photo.id));
  });} finally {db.close();}
}

export async function prepareFeedbackPhoto(file:File):Promise<PreparedPhoto> {
  if(!file.type.startsWith('image/')&&!/\.(jpe?g|png|webp|heic|heif|avif|gif)$/i.test(file.name))throw new Error('请选择图片文件');
  if(file.size>25*1024*1024)throw new Error('图片过大，请选择 25 MB 以内的图片');
  const source=URL.createObjectURL(file);
  try {
    const image=new Image();
    await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('这张图片无法读取，请换一张或转换成 JPG'));image.src=source;});
    const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
    const width=Math.max(1,Math.round(image.naturalWidth*scale)),height=Math.max(1,Math.round(image.naturalHeight*scale));
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const context=canvas.getContext('2d');if(!context)throw new Error('图片处理失败，请重试');
    context.fillStyle='#fff';context.fillRect(0,0,width,height);context.drawImage(image,0,0,width,height);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('图片处理失败，请重试')),'image/jpeg',0.82));
    return {id:`photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,width,height,blob,preview:URL.createObjectURL(blob)};
  } finally {URL.revokeObjectURL(source);}
}
