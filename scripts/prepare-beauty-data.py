# coding: utf-8
"""Prepare real beauty sources and validate the shared optional-field schema."""
import json,re,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT.parent/'数据采集'/'notes'
notes=[]
sources={}
def clean(s): return re.sub(r'\[表情图片:[^\]]+\]','',s or '').strip()
for slot in ('beauty_01','beauty_02'):
 folder=RAW/slot
 n=json.loads((folder/'note.json').read_text())
 comments=[json.loads(x) for x in (folder/'comments.jsonl').read_text().splitlines()]
 media=json.loads((folder/'media.json').read_text())
 images={}
 for m in media:
  local=m.get('local_path')
  if local and (folder/local).exists():
   dest=ROOT/'public'/'assets'/'beauty'/slot/Path(local).name
   dest.parent.mkdir(parents=True,exist_ok=True)
   shutil.copy2(folder/local,dest)
   images[m['media_id']]='/assets/beauty/'+slot+'/'+Path(local).name
  sources[m['media_id']]={'id':m['media_id'],'noteId':slot,'kind':'image','author':n['author']['display_name'],'text':'\n'.join(t['text_raw'] for t in m.get('text_blocks',[])),'image':images.get(m['media_id']),'label':'正文图 '+str(m['order']) if m['owner_source_id'].endswith(':body') else '评论配图','parent':m['owner_source_id'],'date':n.get('edited_at_raw') or ''}
 body=[]
 for b in n['body_blocks']:
  body.append({'id':b['source_id'],'text':clean(b['text']),'tags':b.get('kind')=='tags'})
  sources[b['source_id']]={'id':b['source_id'],'noteId':slot,'kind':'body','author':n['author']['display_name'],'text':clean(b['text']),'label':'笔记正文','date':n.get('edited_at_raw') or ''}
 rows=[]
 for c in comments:
  row={'id':c['source_id'],'noteId':slot,'kind':'comment','author':c['author']['display_name'],'text':clean(c.get('text_plain') or c['text_raw']),'date':c.get('published_at_raw') or '', 'location':c.get('location_raw') or '', 'likes':c.get('likes_raw') or '', 'parent':c.get('root_source_id'),'ai':c.get('content_origin')!='user','images':[images[m] for m in c['media_ids'] if m in images],'label':'原评论'}
  rows.append(row);sources[row['id']]=row
 notes.append({'id':slot,'title':n['title'],'author':n['author']['display_name'],'url':n['source_url'],'date':n.get('edited_at_raw') or '', 'body':body,'metrics':n['metrics_raw'],'images':[images[m] for m in n['media_ids'] if m in images],'comments':rows})
def c(n,i): return f'beauty_0{n}:comment:{i:06d}'
def m(i): return f'beauty_02:media:{i:03d}'
def f(text,refs): return {'text':text,'refs':refs}
cards=[{'noteId':'beauty_01','title':'第一盘眼影怎么选','context':[
 f('原帖肤色：黄 1.5 白；韩妆偶尔用黄一白底妆。',['beauty_01:body:001']),
 f('偏爱中性粉色；本人觉得橘调、大地色显疲惫。',['beauty_01:body:001']),
 f('想买 3CE；闪片、眼线色、卧蚕，三项满足两项即可。',['beauty_01:body:002'])],
 'candidates':[
 {'id':'pink','name':'裸砂粉','tag':'日常粉色','basis':[
 f('香飘优乐美自述黄一白，买过几盘后觉得这盘最适合自己、使用频率最高。',[c(1,132),c(1,137)]),
 f('一口冰可乐觉得日常显色不错，自己黄皮更喜欢它。',[c(1,146),c(1,150)])],
 'cautions':[f('不是完全没有紫调：推荐者随后补充，有一两颗带一点紫调。',[c(1,134),c(1,135)])]},
 {'id':'taro','name':'芋泥盘','tag':'粉紫调 · 闪片有分歧','basis':[
 f('利式懵懵经常用这盘，尤其喜欢闪粉的上眼效果。',[c(1,19)]),
 f('夜雨桐认为可兼顾三项需求，并把色调更正为「灰紫色」。',[c(1,144),c(1,145)])],
 'usage':[f('就是心疼你啊～建议先把第三行第二颗搓细，再上眼。',[c(1,82),c(1,84)])],
 'cautions':[f('小饼干的推荐带有底妆与提亮条件；一口冰可乐更推荐白皮尝试。',[c(1,12),c(1,149)])],
 'differences':[f('同一盘闪片，有人喜欢，也有人直说「闪片不行」。',[c(1,19),c(1,69)])]},
 {'id':'butter','name':'黄油慕斯','tag':'粉棕方向','basis':[f('明天不上课称自己情况相近，买了黄油慕斯；回复里形容偏粉，也有棕色。',[c(1,140),c(1,142)])]},
 {'id':'wakemake','name':'WAKEMAKE 8 号 + HOLIKA 97','tag':'可接受其他品牌','basis':[f('小饼干给常化韩妆的提问者推荐 8 号，眼线色另配 HOLIKA 97 单色。',[c(1,1)])],
 'usage':[f('HOLIKA 97 用于眼线；下至另用眼影。',[c(1,14)])],
 'cautions':[f('这是一套跨品牌搭配，需要单独购买眼线色。',[c(1,1)])]},
 {'id':'brown','name':'深棕哑光','tag':'需要另配闪色','basis':[f('夏咪黛吉用了四年多、换过其他盘后又买回来。',[c(1,10)])],
 'cautions':[f('nekou丽指出缺细闪，自己另配了两颗闪色。',[c(1,11)]),f('原帖本人觉得大地色显疲惫，不能仅凭他人回购直接套用。',['beauty_01:body:001'])]}
 ]}]
names={4:'巧克力商店系列',10:'樱桃派对',11:'奈娃联名',14:'泰迪熊 1.0'}
diffs={5:[94],7:[111],9:[111],11:[42,43,109],13:[111],15:[111]}
sources['beauty_02:title']={'id':'beauty_02:title','noteId':'beauty_02','kind':'body','author':'LVnook','text':notes[1]['title'],'label':'笔记标题','date':notes[1]['date']}
second={'noteId':'beauty_02','title':'花知晓眼影配色对照','context':[f('原帖作者自述黄二白。',['beauty_02:title']),f('作者说明：均为个人感受，主要评价配色。',['beauty_02:body:001'])],'candidates':[]}
for i in range(2,17):
 item={'id':f'image-{i}','name':names.get(i,f'第 {i} 张眼影盘'),'tag':f'原帖图 {i}','image':sources[m(i)]['image'],'basis':[f('作者：'+sources[m(i)]['text'],[m(i)])]}
 if i in names:item['nameRefs']=[c(2,41) if i==4 else c(2,38)]
 if i in diffs:item['differences']=[f(sources[c(2,j)]['author']+'：'+sources[c(2,j)]['text'],[c(2,j)]) for j in diffs[i]]
 second['candidates'].append(item)
cards.append(second)
for card in cards:
 assert len({x['id'] for x in card['candidates']})==len(card['candidates'])
 def validate(v):
  if isinstance(v,dict):
   for key,child in v.items():
    if key in ('refs','nameRefs'):
     assert child
     for ref in child:
      assert ref in sources,ref
      assert sources[ref]['noteId']==card['noteId'],ref
      assert not sources[ref].get('ai'),ref
    else:validate(child)
  elif isinstance(v,list):
   for child in v:validate(child)
 validate(card)
for note in notes:
 for comment in note['comments']:assert not comment['parent'] or comment['parent'] in sources,comment['id']
(ROOT/'src'/'beauty-data.json').write_text(json.dumps({'notes':notes,'sources':sources,'cards':cards},ensure_ascii=False,indent=2))
print(f'Prepared {len(notes)} notes, {sum(len(n["comments"]) for n in notes)} comments, {len(sources)} sources; all references validated.')
