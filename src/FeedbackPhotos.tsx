import {useEffect,useRef,useState,type ChangeEvent} from 'react';
import {CameraIcon,Cross2Icon} from '@radix-ui/react-icons';
import {MAX_FEEDBACK_PHOTOS,prepareFeedbackPhoto,readFeedbackPhoto,type FeedbackPhoto,type PreparedPhoto} from './feedback-photos';

export function FeedbackPhotoPicker({photos,onChange,onBusy,beforePick,disabled=false}:{photos:PreparedPhoto[];onChange:(photos:PreparedPhoto[])=>void;onBusy:(busy:boolean)=>void;beforePick:()=>void;disabled?:boolean}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const alive=useRef(true),processing=useRef(false);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;onBusy(false)}},[onBusy]);
  const pick=async(event:ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(event.target.files||[]);event.target.value='';
    if(!files.length||processing.current)return;
    const remaining=MAX_FEEDBACK_PHOTOS-photos.length;
    processing.current=true;setBusy(true);onBusy(true);setError('');
    const added:PreparedPhoto[]=[];const errors:string[]=[];
    for(const file of files.slice(0,remaining)){
      if(!alive.current)break;
      try{added.push(await prepareFeedbackPhoto(file))}catch(error){errors.push((error as Error).message)}
    }
    if(alive.current){
      onChange([...photos,...added]);
      setError(errors[0]||(files.length>remaining?`最多添加 ${MAX_FEEDBACK_PHOTOS} 张图片`:''));
      setBusy(false);onBusy(false);
    } else added.forEach(photo=>URL.revokeObjectURL(photo.preview));
    processing.current=false;
  };
  return <section className="feedback-photo-picker" aria-label="体验图片">
    <div className="photo-picker-heading"><span>添加图片 <small>选填</small></span><span>{photos.length}/{MAX_FEEDBACK_PHOTOS}</span></div>
    <div className="photo-draft-grid">
      {photos.map((photo,index)=><div className="photo-draft" key={photo.id}>
        <img src={photo.preview} alt={`待发布图片 ${index+1}`} width={photo.width} height={photo.height} draggable={false}/>
        <button type="button" className="remove-photo" aria-label={`删除图片 ${index+1}`} disabled={busy||disabled} onClick={()=>{URL.revokeObjectURL(photo.preview);onChange(photos.filter(p=>p.id!==photo.id))}}><Cross2Icon/></button>
      </div>)}
      {photos.length<MAX_FEEDBACK_PHOTOS&&<label className={'add-feedback-photo '+(busy||disabled?'is-busy':'')}>
        <CameraIcon/><span>{busy?'处理中…':'添加图片'}</span>
        <input type="file" accept="image/*" multiple aria-label="添加体验图片" disabled={busy||disabled} onClick={beforePick} onChange={pick}/>
      </label>}
    </div>
    {error&&<p className="photo-error" role="alert">{error}</p>}
  </section>;
}

function FeedbackPhotoImage({photo,index}:{photo:FeedbackPhoto;index:number}) {
  const [url,setUrl]=useState(''),[failed,setFailed]=useState(false);
  useEffect(()=>{
    let alive=true,objectUrl='';
    setUrl('');setFailed(false);
    readFeedbackPhoto(photo.id).then(blob=>{
      if(!alive)return;
      if(!blob){setFailed(true);return}
      objectUrl=URL.createObjectURL(blob);setUrl(objectUrl);
    }).catch(()=>{if(alive)setFailed(true)});
    return()=>{alive=false;if(objectUrl)URL.revokeObjectURL(objectUrl)};
  },[photo.id]);
  return <div className="feedback-photo" style={{aspectRatio:`${photo.width}/${photo.height}`}}>
    {url?<img src={url} alt={`使用体验图片 ${index+1}`} width={photo.width} height={photo.height} loading="lazy" decoding="async" draggable={false}/>:failed?<span>图片暂不可用</span>:null}
  </div>;
}

export function FeedbackPhotos({photos}:{photos?:FeedbackPhoto[]}) {
  if(!photos?.length)return null;
  return <div className={'feedback-photo-grid '+(photos.length===1?'single':photos.length===2||photos.length===4?'two-columns':'three-columns')} aria-label="使用体验配图">
    {photos.map((photo,index)=><FeedbackPhotoImage key={photo.id} photo={photo} index={index}/>)}
  </div>;
}
