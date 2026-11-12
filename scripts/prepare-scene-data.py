"""Import the six approved notes without changing the collection archive."""
import json, shutil, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; RAW=ROOT.parent/'数据采集/notes'
notes=[]; sources={}; frames={}
def readable(text):return re.sub(r'\[无法辨认\]','',text or '').strip()
for topic in ['cooking','cleaning','citywalk']:
 for num in [1,2]:
  slot=f'{topic}_0{num}'; folder=RAW/slot
  n=json.loads((folder/'note.json').read_text()); media=json.loads((folder/'media.json').read_text())
  comments=[json.loads(x) for x in (folder/'comments.jsonl').read_text().splitlines() if x.strip()]
  author=n['author']['display_name']; date=n.get('edited_at_raw') or n.get('published_at_raw') or ''
  images={}
  for m in media:
   local=m.get('local_path')
   # Evidence screenshots of comments are retained in the archive, not mistaken for photos.
   if local and local.startswith('media/') and (folder/local).exists() and m['media_id']!='cleaning_01:media:009':
    dest=ROOT/'public/assets/scenes'/slot/Path(local).name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(folder/local,dest)
    url=f'/assets/scenes/{slot}/{Path(local).name}';images[m['media_id']]=url
    frames[url]=[435,222,993,1324]
    if not m['owner_source_id'].endswith(':body') or (slot=='citywalk_02' and m['order']==12):frames[url]=[884,222,896,1197]
    if slot=='cooking_01' and m['media_id'].endswith(':002'):frames[url]=[355,222,993,1230]
    if slot=='cooking_02' and m['order'] in [1,2] and m['owner_source_id'].endswith(':body'):frames[url]=[270,387,1324,994]
   owner=next((c for c in comments if c['source_id']==m['owner_source_id']),None)
   sources[m['media_id']]={'id':m['media_id'],'noteId':slot,'kind':'image','author':owner['author']['display_name'] if owner else author,'date':(owner.get('published_at_raw') or date) if owner else date,'text':'\n'.join(t['text_raw'] for t in m.get('text_blocks',[])) or m.get('visual_description',''),'image':images.get(m['media_id']),'parent':m['owner_source_id'],'label':('原帖图 '+str(m['order'])) if not owner else '评论配图'}
  def body_source(id,text,label='笔记正文'):
   sources[id]={'id':id,'noteId':slot,'kind':'body','author':author,'text':text,'label':label,'date':date}
  body=[]
  for b in n['body_blocks']:
   text=readable(b['text'])
   if not text:continue
   body.append({'id':b['source_id'],'text':text,'tags':text.startswith('#')});body_source(b['source_id'],text)
  body_source(slot+':title',n['title'],'笔记标题')
  rows=[]
  for c in comments:
   row={'id':c['source_id'],'noteId':slot,'kind':'comment','author':c['author']['display_name'],'text':readable(c.get('text_raw','')),'date':c.get('published_at_raw') or '', 'location':c.get('location_raw') or '', 'likes':c.get('likes_raw') or '', 'parent':(c.get('root_source_id') or c.get('parent_source_id')) if c.get('level')=='reply' else None,'ai':c.get('content_origin') in ['ai','ai_generated'] or c['author']['display_name']=='点点','images':[images[m] for m in c.get('media_ids',[]) if m in images],'label':'原评论'}
   if row['parent']==row['id']:row['parent']=None
   rows.append(row);sources[row['id']]=row
  notes.append({'id':slot,'title':n['title'],'author':author,'url':n['source_url'],'date':date,'body':body,'metrics':n['metrics_raw'],'images':[images[m] for m in n['media_ids'] if m in images],'comments':rows})
for source in sources.values():
 if source.get('image') is None:source.pop('image',None)
(ROOT/'src/scene-data.json').write_text(json.dumps({'notes':notes,'sources':sources},ensure_ascii=False,indent=2))
(ROOT/'src/media-frames.json').write_text(json.dumps(frames,indent=2))
print(f'Imported {len(notes)} notes / {sum(len(n["comments"]) for n in notes)} comments / {len(frames)} photos')
