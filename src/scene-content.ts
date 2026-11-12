import type {BeautyCard, Fact, Candidate} from './data';
import type {TaskExtras} from './task-content';
import type {Followup} from './ai-content';
const b=(n:string,i:number)=>`${n}:body:${String(i).padStart(3,'0')}`;
const c=(n:string,i:number)=>`${n}:comment:${String(i).padStart(6,'0')}`;
const m=(n:string,i:number)=>`${n}:media:${String(i).padStart(3,'0')}`;
const photo=(n:string,i:number)=>`/assets/scenes/${n}/${String(i).padStart(3,'0')}.jpg`;
const f=(text:string,...refs:string[]):Fact=>({text,refs});
const cooking='cooking_01',layer='cooking_02',canvas='cleaning_01',shoes='cleaning_02',streets='citywalk_01',river='citywalk_02';
const riceIngredients=[f('大米 1 杯、腊肠 2 根、香菇 4 朵、胡萝卜半根；玉米粒、豌豆适量。',m(cooking,7)),f('酱汁：生抽 2 勺、老抽半勺、蚝油 1 勺、少许糖、几滴香油，加 2 勺清水拌匀。',...Array.from({length:6},(_,i)=>b(cooking,32+i)))];
const riceSteps=[f('淘洗大米；有时间可以浸泡约 10 分钟。内胆底部和四周薄刷一层油。',b(cooking,14),b(cooking,15),b(cooking,19)),f('倒入大米和水，再倒入酱汁。作者用水刚没过米约 0.5 cm，可先对照自己平时煮饭的水位。',b(cooking,24),b(cooking,26),b(cooking,28),b(cooking,38)),f('将切好的食材铺在米上，选择普通煮饭模式。',b(cooking,42),b(cooking,45)),f('煮好后继续焖约 10 分钟，再从边缘轻轻翻拌。',b(cooking,50),b(cooking,54))];
const riceCautions=[f('不必追求锅巴而刻意减水。评论里有人遇到锅底发硬，刷油后也仍在排查水量。',c(cooking,85),c(cooking,86),c(cooking,87)),f('正文用的是一次铺料的流程；作者在另一条回复中提过蒸 10 分钟再加菜，两种操作不要混在同一次照做。',b(cooking,46),c(cooking,15),c(cooking,16))];
const layerIngredients=[f('原帖按 2–3 人份准备：土豆 1 个、胡萝卜半根、洋葱半个、腊肠或香肠 2 根，豌豆、玉米适量；香菇可选。大米用量未明确。',...Array.from({length:5},(_,i)=>b(layer,i+5))),f('土豆洋葱调味：盐 2–3 g、适量黑胡椒、香油 1–2 勺。拌米：生抽 3 勺、老抽 1 勺、蚝油 1 勺。',b(layer,13),b(layer,16))];
const waterCaution=f('原帖写米水约 1:1，评论里又讨论重量、体积和蔬菜出水量，口径不够一致。先按自己的米和电饭煲平时水量调整，不把 1:1 当成通用刻度。',b(layer,22),c(layer,1),c(layer,2),c(layer,7),c(layer,9));
const route=f('永嘉路 → 太原路 → 永康路 → 嘉善路 → 永嘉路。可从这些道路的任意交叉口进入环线。',b(streets,5),b(streets,6));
const streetLimits=[f('建筑以外观欣赏为主。原帖提到的故居、庭院有未开放或私人使用的情况，不把入内参观列入路线。',b(streets,13),b(streets,16)),f('工作日尽量避开周边学校放学时段。',b(streets,27))];
const riverLimits=[f('评论里有国庆期间拦车、人多时骑行不便的反馈。出发时以入口标识和现场管理为准，不能把过去的体验当作今天的通行承诺。',c(river,19),c(river,20),c(river,29)),f('原帖的“下午 5 点”特指春季。想看落日或蓝调，按出行当天日落时间安排。',b(river,10))];
export const sceneCards:BeautyCard[]=[
 {noteId:cooking,title:'电饭煲腊肠焖饭',candidates:[
  {id:'one-pot',name:'家常一锅焖',tag:'一锅焖',intro:'如果你想少洗一口锅，可以选一次铺料的一锅焖。Yu-lin 的笔记给了酱汁和煮饭流程，评论里还补了一张用料卡。',image:photo(cooking,1),preparation:riceIngredients,steps:riceSteps,cautions:riceCautions,differences:[f('有人觉得成品比较普通、不像砂锅煲仔饭；更适合把它当省事的一锅饭，而不是保证做出锅巴。',c(cooking,214))]},
  {id:'ham',name:'腊肠不够，火腿来补上',tag:'加点火腿',intro:'如果家里的腊肠不够，可以考虑加一点火腿肠。Yu-lin 的评论区里，秦璃璃照做后补了火腿肠，反馈还不错；可沿用这篇的一锅焖流程。',preparation:[f('在原有腊肠之外补一些火腿肠，其余食材按基础方案准备。评论没有给出两者的具体比例。',c(cooking,113),c(cooking,114)),f('大米 1 杯、香菇 4 朵、胡萝卜半根；玉米、豌豆适量。',m(cooking,7)),...riceIngredients.slice(1)],steps:riceSteps,cautions:[f('这条反馈是腊肠不够时加火腿肠，没有完全不用腊肠的对照结果；先按自己食材的咸淡调整酱汁。',c(cooking,113),c(cooking,114)),...riceCautions.slice(0,1)]}
 ]},
 {noteId:layer,title:'腊肠焖饭的铺料顺序',candidates:[
  {id:'layered',name:'土豆洋葱打底，腊肠丁拌米',tag:'分层铺料',intro:'如果你愿意多花一点时间切配，可以试试分层铺料。momo吃吃吃 的笔记把土豆洋葱放底部、腊肠丁拌进米里，适合想调整铺料顺序的人。',image:photo(layer,2),preparation:layerIngredients,steps:[f('土豆、洋葱切丁，拌入盐、黑胡椒和香油，铺平在锅底。',b(layer,13),b(layer,18)),f('洗净的米拌入腊肠丁和酱汁，铺在蔬菜层上，先不搅拌。',b(layer,15),b(layer,16),b(layer,19)),f('上层放胡萝卜、豌豆、玉米和可选香菇，再放腊肠片；按自己的米量加水。',b(layer,20),b(layer,21),b(layer,22)),f('使用正常煮饭模式，煮好后焖 10–15 分钟，再翻拌均匀。',b(layer,23),b(layer,24),b(layer,25))]},
  {id:'no-onion',name:'不放土豆洋葱，也先把腊肠拌米',tag:'去掉土豆洋葱',intro:'如果你不喜欢土豆或洋葱，可以直接跳过这层。momo吃吃吃 在回复里允许省去这两样，仍建议把腊肠丁和米拌在一起。',preparation:[f('原帖 2–3 人份用腊肠或香肠 2 根、胡萝卜半根、豌豆和玉米适量，香菇可选；米量未明确。拌米调味为生抽 3 勺、老抽 1 勺、蚝油 1 勺。',b(layer,5),b(layer,6),b(layer,7),b(layer,8),b(layer,9),b(layer,16)),f('省去土豆、洋葱及这一层的调味；保留米、腊肠和自己喜欢的上层蔬菜。',c(layer,21),c(layer,22),b(layer,20))],steps:[f('把腊肠丁拌进洗好的米，再拌生抽、老抽和蚝油。',c(layer,22),b(layer,15),b(layer,16)),f('将蔬菜放在上层，加水后用普通煮饭模式；煮好再焖 10–15 分钟、翻拌。',b(layer,20),b(layer,22),b(layer,23),b(layer,24),b(layer,25))]},
  {id:'stir-fry',name:'米和菜先炒，再入电饭煲',tag:'先炒后焖',intro:'如果你愿意多洗一口锅，也可以参考评论区的先炒后焖。糖果的小屋（接长沙上门做饭）分享了先炒生米和菜的做法，属于另一种处理思路。',steps:[f('生米和蔬菜先炒，再放进电饭煲焖。原评论没有提供炒制时长和完整调味用量。',c(layer,10),c(layer,13),c(layer,18))],cautions:[f('水量需要区分米是否提前泡过。评论者说未泡米按平时煮饭加水、泡过则少加；不能套用固定比例。',c(layer,14),c(layer,15))]}
 ]},
 {noteId:canvas,title:'白帆布鞋发黄后怎么处理',candidates:[
  {id:'rewet',name:'重新润湿，白纸贴合阴干',tag:'重新包纸',intro:'如果你的白帆布鞋是洗完晾干后泛黄，可以先看重新润湿、包纸的办法。魔芋脑袋 的评论区里，祝你爆炸💥补充了这种做法，但也有人包纸后仍然发黄。',steps:[f('重新润湿鞋面，冲洗干净后，用白色纸巾贴合包住鞋面。',c(canvas,3),c(canvas,26),c(canvas,309)),f('放在没有阳光直晒的地方阴干，完全干燥后再查看效果。',b(canvas,4),c(canvas,258))],cautions:[f('选白色纸巾；有评论提到黄色纸巾导致染色。',c(canvas,155))],differences:[f('包纸并不保证解决所有发黄：有人反复处理后改善，也有人包纸、阴干仍然发黄。',c(canvas,169),c(canvas,460))]},
  {id:'toothpaste',name:'牙膏局部刷洗，再包纸阴干',tag:'局部刷洗',intro:'如果是白帆布鞋局部轻微泛黄，可以参考魔芋脑袋 的牙膏刷洗步骤。作者自己也说，大面积或严重发黄时效果有限，先确认鞋子的洗护要求。',image:photo(canvas,4),preparation:[f('原帖对象是白色帆布鞋；用到牙膏、刷子、清水和白色纸巾。',b(canvas,1),b(canvas,4))],steps:[f('先打湿鞋面，把牙膏涂在发黄处，局部刷洗。',b(canvas,4)),f('冲洗干净，用白纸贴合包裹，放在阴凉处晾干。',b(canvas,4))],cautions:[f('作者说严重或大面积发黄时牙膏不太管用；不要把这一结果外推到所有鞋面材质。',b(canvas,4))]}
 ]},
 {noteId:shoes,title:'白鞋洗完怎么晾',candidates:[
  {id:'rinse',name:'充分漂洗，再包纸晾干',tag:'漂洗包纸',intro:'如果你想先改善洗完后的晾晒过程，可以从漂洗和包纸着手。不是山谷 的讨论里，奶芙桃桃🍑冰强调漂洗干净、避免直晒；先对照鞋子本身的洗护说明。',image:photo(shoes,1),steps:[f('清洁后把泡沫漂洗干净，再用白纸贴合包住鞋面。',c(shoes,53),c(shoes,49)),f('放在通风、避免阳光直晒的地方晾干。',c(shoes,53),c(shoes,50))],differences:[f('包纸也会遇到失败：有用户说薄纸包后仍泛黄，也有牛仔拼接鞋留下泛黄边缘。',c(shoes,17),c(shoes,115))]},
  {id:'spin',name:'允许脱水的鞋，脱水后通风晾干',tag:'脱水晾干',intro:'如果鞋子和设备的洗护说明允许脱水，可以参考评论里的脱水后晾干方案。不是山谷 的笔记里，momo、Jennie 都分享过自己的效果；不能直接用于不明材质的鞋。',steps:[f('有用户用洗衣袋或旧布包好鞋子后脱水，再在通风处晾干。评论没有提供可通用的转速和时间。',c(shoes,62),c(shoes,50))],basis:[f('momo 和 Jennie 分享了脱水后不再发黄的个人体验。',c(shoes,27),c(shoes,33),c(shoes,37))],cautions:[f('先确认鞋面材质和洗护限制。评论里有人连是否为翻毛皮都无法仅凭图片确认，不宜直接照搬机洗脱水。',c(shoes,113),c(shoes,116))]}
 ]},
 {noteId:streets,title:'梧桐区的小马路怎么逛',candidates:[
  {id:'loop',name:'四条小马路，走一个松弛环线',tag:'街区散步',intro:'如果你想看小马路、建筑外观和市井生活，可以走永嘉路这条环线。飞天遁地上海通 的笔记把四条道路串在一起；这里更适合慢逛，不是密集景点打卡。',image:photo(streets,7),route:[route],steps:[f('永嘉路看建筑外观，走到太原路交叉口附近，看原帖图 7 的爬山虎建筑。',b(streets,13),b(streets,14)),f('太原路沿街走过庭院外侧，再去永康路看看咖啡馆和小店。',b(streets,16),b(streets,10),b(streets,11)),f('经嘉善路看老石库门与街边生活，再回到永嘉路。',b(streets,6),b(streets,18))],timing:[f('作者回复纯走、不吃东西约半小时。这只是个人步速参考，半天可以把时间留给停留与休息。',c(streets,64),c(streets,65))],differences:[f('有人走完觉得景观普通、停车多，也有人喜欢这里的生活感。期待大景点或连续拍照点的话，先看原帖照片再决定。',c(streets,3),c(streets,4),c(streets,19))]},
  {id:'cafes',name:'沿环线找一家店，坐一会儿',tag:'咖啡甜品',intro:'如果你想把半天花在边走边吃、坐下来休息，可以用同一条环线，把停留重点放在永康路和永嘉路。飞天遁地上海通 提到了甜甜圈、冰淇淋和咖啡馆，可按口味取舍。',image:photo(streets,10),route:[route],steps:[f('想吃甜甜圈，可以先查看原帖里的 Nunu Donut 青提口味；照片 10、11 有对应配图。',b(streets,20),b(streets,21)),f('偏爱抹茶冰淇淋，可以对照 Azabuya 的低号抹茶。作者不喜欢酱油味，属于个人口味差异。',b(streets,22),b(streets,23)),f('想喝咖啡，可以沿永康路挑店休息；作者没有提供可比较的咖啡口味评价。',b(streets,10),b(streets,25))],cautions:[f('这些是发帖时的店铺与口味记录。出发前核对店铺是否营业、菜单和地址，再决定停留点。',b(streets,20),b(streets,22),b(streets,25)),...streetLimits.slice(1)]}
 ]},
 {noteId:river,title:'陆家嘴滨江慢慢逛',candidates:[
  {id:'walk',name:'沿江步行，看外滩和天际线',tag:'滨江步行',intro:'如果你想看黄浦江、外滩和陆家嘴天际线，又不想骑车，可以选滨江步行。kkdkmf啊呜 在评论里明确回复可以步行，也建议先在富都滨江看外滩。',image:photo(river,3),route:[f('从方便的东岸绿道入口进入，选择陆家嘴附近江边路段；原帖图 12 标了入口参考。',b(river,3),c(river,45),c(river,46),m(river,12)),f('可以先在富都滨江步行看外滩，再根据体力决定是否继续往南。',c(river,79))],steps:[f('边走边看对岸外滩、东方明珠和陆家嘴建筑，喜欢的视角再停下来拍照。',b(river,8),c(river,66),c(river,67))],timing:[f('如果想把白天、落日和亮灯放在一起看，可把行程安排在傍晚前后；原帖的时间建议来自春季。',b(river,10))]},
  {id:'ride',name:'沿江骑一段，喜欢的地方停一停',tag:'沿江骑行',intro:'如果你想吹风、愿意骑一段，可以参考 kkdkmf啊呜 的东岸绿道骑行。先确认入口是否允许骑行，人多的滨江路段可改为步行。',image:photo(river,12),route:[f('搜索东岸绿道入口，对照原帖图 12；不必走完整条绿道，可以只选陆家嘴附近的一段。',b(river,3),c(river,45),c(river,46),c(river,55),c(river,56),m(river,12))],steps:[f('作者建议先在富都滨江步行看外滩，往南走、人少后再骑。',c(river,79)),f('在允许骑行的路段按自己的节奏前进，想拍照时先停好车。',b(river,6))],timing:[f('作者在回复里建议天热时骑约半小时，可按自己的喜好安排；原帖没有固定全程里数。',c(river,23),c(river,24))]}
 ]}
];
const question=(n:string,id:string,title:string,q:number,answers:number[],candidateId?:string)=>({id,noteId:n,title,questionRef:c(n,q),answerRefs:answers.map(i=>c(n,i)),candidateId});
export const sceneExtras:Record<string,TaskExtras>={
 [cooking]:{intro:'把用料、酱汁和煮饭顺序放在一起，按家里现有的食材来选。',notices:[f('米量增减时，酱汁也需要跟着调整。作者回复可以相应增加，但没有给出固定换算。',c(cooking,19),c(cooking,20))],questions:[question(cooking,'q-cook-mode','普通煮饭模式就可以吗？',121,[122],'one-pot'),question(cooking,'q-cook-portion','米放得更多，酱汁也要增加吗？',19,[20],'one-pot')]},
 [layer]:{intro:'比较铺料、拌米和先炒后焖，选择愿意花的时间与工序。',notices:[waterCaution],questions:[question(layer,'q-layer-omit','不喜欢土豆洋葱，可以不放吗？',21,[22],'no-onion'),question(layer,'q-layer-water','先炒再焖，水应该放多少？',14,[15],'stir-fry')]},
 [canvas]:{intro:'先看白帆布鞋的处理条件，再对照包纸与局部刷洗的不同体验。',notices:[f('这篇针对白色帆布鞋；彩色、拼接或不明材质的鞋，先核对洗护方式。作者回复也提醒彩色部位会褪色。',b(canvas,1),c(canvas,275),c(canvas,536))],discussions:[f('原帖还有直接使用 84 的经历，但相关讨论里也出现变红和布料受损的反馈，还有人用漂白液久泡后更黄。不要因为一次成功分享就反复加量或久泡。',b(canvas,5),c(canvas,466),c(canvas,609),c(canvas,620))]},
 [shoes]:{intro:'对照漂洗、包纸和脱水后的晾干反馈，先确认自己的鞋是否适用。',notices:[f('问问题时可以补上鞋面材质和之前怎么洗、怎么晾。评论中的牛仔拼接鞋与不明材质鞋，处理条件并不相同。',c(shoes,113),c(shoes,115),c(shoes,116))],questions:[question(shoes,'q-shoe-material','这双鞋是什么材质，能照这个方法洗吗？',113,[116])]},
 [streets]:{intro:'用一条环线看建筑与小店，也可以把时间留给咖啡甜品。',notices:streetLimits,questions:[question(streets,'q-loop-time','只走这条路线大概多久？',64,[65],'loop')]},
 [river]:{intro:'在滨江步行和骑行之间切换，按体力、人流和想看的景色决定。',notices:riverLimits,questions:[question(river,'q-river-walk','不骑车，步行也可以吗？',66,[67],'walk'),question(river,'q-river-section','必须从起点一直走到终点吗？',45,[46],'ride')]},
};
export type Scene={id:string;query:string;match:RegExp;filters:string[];noteIds:string[];intro:string;highlight:string;heading:string;lead:Fact;takeaways:string[];followups:string[]};
export const scenes:Scene[]=[
 {id:'beauty',query:'第一盘眼影怎么选',match:/眼影|黄皮|粉色|美妆|化妆|3ce|花知晓|配色|黄二白|裸砂|芋泥/i,filters:['综合','3CE','花知晓'],noteIds:['beauty_01','beauty_02'],intro:'',highlight:'',heading:'',lead:f(''),takeaways:[],followups:[]},
 {id:'cooking',query:'电饭煲腊肠焖饭怎么做',match:/电饭|焖饭|煲仔饭|腊肠|做饭/,filters:['综合','一锅焖','分层铺料'],noteIds:[cooking,layer],intro:'想用电饭煲做腊肠焖饭，先按你愿意花的工序来选。',highlight:'想省事，用一次铺料；愿意多切配，试试土豆洋葱打底、腊肠丁拌米。',heading:'先选工序，再对照用料',lead:f('如果你更在意省事，可以从 Yu-lin 的一锅焖开始；想调整铺料顺序，则可以参考 momo吃吃吃 的分层做法。两篇用水与调味口径不同，选定一套后再照着做。',b(cooking,42),b(layer,18),b(layer,19),b(layer,22)),takeaways:['想少一步：一次铺料，煮好后再焖。','想试分层：土豆洋葱在下，腊肠丁先拌米。','水量别照搬：米、设备和蔬菜含水量都要结合自己的经验核对。'],followups:['不想放土豆洋葱','没有腊肠怎么办','加多少水']},
 {id:'cleaning',query:'白鞋洗完发黄怎么办',match:/白鞋|帆布鞋|洗鞋|发黄|清洁/,filters:['综合','发黄后处理','洗后晾干'],noteIds:[canvas,shoes],intro:'白鞋洗完发黄，先分清是已经留下黄印，还是想调整下次洗后的晾法。',highlight:'已泛黄的白帆布鞋，可以先看包纸与局部刷洗；想改善晾干过程，先核对漂洗和脱水条件。',heading:'先看材质，再选处理方法',lead:f('如果你的鞋是白帆布，可以对照 魔芋脑袋 的局部处理；如果更想改善洗后晾干过程，可以看 不是山谷 评论区的漂洗、包纸与脱水经验。同一个方法也有失败反馈，先确认适用条件。',b(canvas,1),b(canvas,4),c(shoes,53),c(shoes,33),c(canvas,460)),takeaways:['先核对材质和洗护说明，再选方法。','包纸也有不同结果，不把一次成功当成保证。','持续泛黄或材质不明时，先查原因，不叠加更多处理。'],followups:['包纸后还是黄','可以用洗衣机脱水吗','严重发黄怎么办']},
 {id:'citywalk',query:'上海半天怎么逛',match:/上海|半天|梧桐|永嘉|永康|陆家嘴|滨江|citywalk|骑行/i,filters:['综合','梧桐街区','陆家嘴滨江'],noteIds:[streets,river],intro:'在上海留出半天，可以先选你更想看到的城市一面。',highlight:'喜欢小马路和咖啡甜品，去梧桐街区；想看江景与天际线，选陆家嘴滨江。',heading:'选一种节奏，半天慢慢逛',lead:f('如果你想沿街看看建筑、坐下来喝点东西，可以考虑 飞天遁地上海通 的四条小马路环线；如果更喜欢江风和城市夜景，可以参考 kkdkmf啊呜 的滨江玩法，步行、骑行都可按条件选择。',b(streets,6),b(streets,10),b(river,8),c(river,67)),takeaways:['喜欢街区生活感：走永嘉路一带，留时间给小店。','喜欢开阔江景：选陆家嘴滨江，不必走完全程。','店铺营业与骑行限制出发前核对，时间按当天日落安排。'],followups:['想逛咖啡甜品店','不想骑车','想看落日和夜景']}
];
export const sceneForQuery=(q:string)=>scenes.find(s=>s.match.test(q));
export const sceneForNote=(id:string)=>scenes.find(s=>s.noteIds.includes(id))!;
export const sceneForId=(id:string)=>scenes.find(s=>s.id===id)||scenes[0];
export function respondToScene(scene:Scene,question:string):Followup{
 let noteId='',candidateId='',answer='',refs:string[]=[];
 if(scene.id==='cooking'){
  if(/土豆|洋葱/.test(question)){noteId=layer;candidateId='no-onion'}
  else if(/没有腊肠|火腿/.test(question)){noteId=cooking;candidateId='ham';answer='如果只是腊肠不够，可以参考秦璃璃加火腿肠的做法，作者也认可了这个搭配。如果完全不用腊肠，这两篇没有明确的对照结果。';refs=[c(cooking,113),c(cooking,114)]}
  else if(/水|比例/.test(question)){answer=waterCaution.text;refs=waterCaution.refs;noteId=layer;candidateId='layered'}
 }else if(scene.id==='cleaning'){
  if(/脱水|洗衣机/.test(question)){noteId=shoes;candidateId='spin'}
  else if(/还是黄|包纸/.test(question)){answer='如果包纸后还是黄，先核对鞋面材质、漂洗和晾法。魔芋脑袋 的评论里，包纸有改善也有失败反馈；不是山谷 的讨论还出现了牛仔拼接鞋泛黄，不能认为是同一种情况。';refs=[c(canvas,169),c(canvas,460),c(shoes,115)];noteId=canvas;candidateId='rewet'}
  else if(/严重|84|漂白/.test(question)){answer=sceneExtras[canvas].discussions![0].text;refs=sceneExtras[canvas].discussions![0].refs;noteId=canvas}
 }else if(scene.id==='citywalk'){
  if(/咖啡|甜品|小店/.test(question)){noteId=streets;candidateId='cafes'}
  else if(/骑车|步行/.test(question)){noteId=river;candidateId='walk'}
  else if(/落日|夜景|几点|时间/.test(question)){answer='如果你想看落日和夜景，可以优先选陆家嘴滨江。kkdkmf啊呜 的原帖按春季安排下午 5 点左右出发；你的出行日期不同，要按当天日落时间调整，不把 5 点当全年固定时间。';refs=[b(river,10),b(river,11)];noteId=river;candidateId='walk'}
 }
 if(candidateId&&!answer){const plan=sceneCards.find(x=>x.noteId===noteId)!.candidates.find(x=>x.id===candidateId)!;answer=plan.intro!;refs=Object.values(plan).flatMap(v=>Array.isArray(v)?v.flatMap(x=>typeof x==='object'&&'refs' in x?x.refs:[]):[])}
 return {question,answer:answer||'这两篇暂时没有足够的内容直接回答这个问题。可以先从下面的方向继续看：'+scene.followups.join('、')+'。',refs:refs.length?refs:scene.lead.refs,...(noteId?{noteId,candidateId}:{} )};
}
