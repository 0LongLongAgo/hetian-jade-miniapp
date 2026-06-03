// 珠子数据 — 支持多色系、多尺寸、带图片URL预留
// 完整字段说明（后台管理系统对应）：
//   id, name, size, price, weight, color, colorGroup, category
//   img (string, 后台留好上传) — 珠子展示图片 URL
//   meaning (string, 后台留好编写) — 寓意文案，用户点击时展示
//   model3dUrl (string, 后台留好上传) — 3D 模型文件 URL (.glb/.obj/.stl)
//   description (string) — 珠子详细描述
//   material (string) — 材质（如"和田玉青海料"）
//   origin (string) — 产地（如"青海"）
//   stock (number) — 库存
//   sizes (array) — 后台自定义尺寸 [{sizeLabel, price, weight, stock}]
// 当前为本地回退数据，后端就绪后替换为 API 调用。
const beadData = {
  '主珠': {
    '羊脂白': [
      { id: 'yz1', name: '羊脂白·凝脂', size: '8mm', price: 38.00, weight: 1.0, color: '#F5F2EB', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '凝脂如玉，温润如初', model3dUrl: '', description: '顶级羊脂白玉，油润细腻如凝脂', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'yz2', name: '羊脂白·凝脂', size: '10mm', price: 48.00, weight: 1.4, color: '#F5F2EB', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '凝脂如玉，温润如初', model3dUrl: '', description: '顶级羊脂白玉，油润细腻如凝脂', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'yz3', name: '羊脂白·凝脂', size: '12mm', price: 58.00, weight: 1.9, color: '#F5F2EB', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '凝脂如玉，温润如初', model3dUrl: '', description: '顶级羊脂白玉，油润细腻如凝脂', material: '和田玉青海料', origin: '青海', stock: 30 },
      { id: 'yz4', name: '羊脂白·润雪', size: '8mm', price: 28.00, weight: 0.9, color: '#F8F5F0', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '如雪洁白，纯净无瑕', model3dUrl: '', description: '润白如雪，质地纯净细腻', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'yz5', name: '羊脂白·润雪', size: '10mm', price: 35.00, weight: 1.2, color: '#F8F5F0', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '如雪洁白，纯净无瑕', model3dUrl: '', description: '润白如雪，质地纯净细腻', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'yz6', name: '羊脂白·月光', size: '6mm', price: 18.00, weight: 0.5, color: '#F0ECE8', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '月光皎洁，温柔似水', model3dUrl: '', description: '淡雅月光白，温婉柔和', material: '和田玉青海料', origin: '青海', stock: 80 },
      { id: 'yz7', name: '羊脂白·月光', size: '8mm', price: 26.00, weight: 0.8, color: '#F0ECE8', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '月光皎洁，温柔似水', model3dUrl: '', description: '淡雅月光白，温婉柔和', material: '和田玉青海料', origin: '青海', stock: 70 },
      { id: 'yz8', name: '羊脂白·月光', size: '10mm', price: 33.00, weight: 1.1, color: '#F0ECE8', colorGroup: '羊脂白', category: '主珠', img: '', meaning: '月光皎洁，温柔似水', model3dUrl: '', description: '淡雅月光白，温婉柔和', material: '和田玉青海料', origin: '青海', stock: 60 }
    ],
    '烟紫': [
      { id: 'p1', name: '烟紫·星月', size: '6mm', price: 3.00, weight: 0.5, color: '#7B5B95', colorGroup: '烟紫', category: '主珠', img: '', meaning: '星月交辉，紫气东来', model3dUrl: '', description: '烟紫色和田玉青海料，冰透水润', material: '和田玉青海料', origin: '青海', stock: 100 },
      { id: 'p2', name: '烟紫·冰魄', size: '8mm', price: 3.80, weight: 0.8, color: '#8B6BA5', colorGroup: '烟紫', category: '主珠', img: '', meaning: '冰清玉洁，紫韵天成', model3dUrl: '', description: '帝王紫调，质地细腻温润', material: '和田玉青海料', origin: '青海', stock: 80 },
      { id: 'p3', name: '烟紫·紫微', size: '10mm', price: 5.20, weight: 1.2, color: '#7B5B95', colorGroup: '烟紫', category: '主珠', img: '', meaning: '紫微高照，贵人临门', model3dUrl: '', description: '冰紫底色，光感通透', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'p4', name: '烟紫·帝紫', size: '12mm', price: 7.00, weight: 1.7, color: '#5E3D7A', colorGroup: '烟紫', category: '主珠', img: '', meaning: '帝王之紫，尊贵典雅', model3dUrl: '', description: '深帝王紫，浓郁饱满', material: '和田玉青海料', origin: '青海', stock: 40 }
    ],
    '藕粉': [
      { id: 'of1', name: '藕粉·桃花', size: '6mm', price: 5.80, weight: 0.5, color: '#E8C4C4', colorGroup: '藕粉', category: '主珠', img: '', meaning: '桃花灼灼，春意盎然', model3dUrl: '', description: '淡雅藕粉色，似桃花初绽', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'of2', name: '藕粉·桃花', size: '8mm', price: 7.50, weight: 0.8, color: '#E8C4C4', colorGroup: '藕粉', category: '主珠', img: '', meaning: '桃花灼灼，春意盎然', model3dUrl: '', description: '淡雅藕粉色，似桃花初绽', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'of3', name: '藕粉·桃花', size: '10mm', price: 9.80, weight: 1.2, color: '#E8C4C4', colorGroup: '藕粉', category: '主珠', img: '', meaning: '桃花灼灼，春意盎然', model3dUrl: '', description: '淡雅藕粉色，似桃花初绽', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'of4', name: '藕粉·樱雪', size: '8mm', price: 8.00, weight: 0.8, color: '#F0D0D0', colorGroup: '藕粉', category: '主珠', img: '', meaning: '樱花似雪，浪漫天真', model3dUrl: '', description: '浅藕粉如樱花飘雪，温润可爱', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'of5', name: '藕粉·樱雪', size: '10mm', price: 10.50, weight: 1.2, color: '#F0D0D0', colorGroup: '藕粉', category: '主珠', img: '', meaning: '樱花似雪，浪漫天真', model3dUrl: '', description: '浅藕粉如樱花飘雪，温润可爱', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'of6', name: '藕粉·芙蓉', size: '6mm', price: 6.50, weight: 0.5, color: '#DCA0A0', colorGroup: '藕粉', category: '主珠', img: '', meaning: '芙蓉出水，清雅高洁', model3dUrl: '', description: '粉嫩藕色如出水芙蓉，清透动人', material: '和田玉青海料', origin: '青海', stock: 55 },
      { id: 'of7', name: '藕粉·芙蓉', size: '8mm', price: 8.50, weight: 0.8, color: '#DCA0A0', colorGroup: '藕粉', category: '主珠', img: '', meaning: '芙蓉出水，清雅高洁', model3dUrl: '', description: '粉嫩藕色如出水芙蓉，清透动人', material: '和田玉青海料', origin: '青海', stock: 45 }
    ],
    '湖水绿': [
      { id: 'hsl1', name: '湖水绿·翠微', size: '6mm', price: 2.80, weight: 0.5, color: '#5D9B7B', colorGroup: '湖水绿', category: '主珠', img: '', meaning: '翠微山色，碧波荡漾', model3dUrl: '', description: '湖水绿色如一泓清泉，清新怡人', material: '和田玉青海料', origin: '青海', stock: 80 },
      { id: 'hsl2', name: '湖水绿·翠微', size: '8mm', price: 3.50, weight: 0.8, color: '#5D9B7B', colorGroup: '湖水绿', category: '主珠', img: '', meaning: '翠微山色，碧波荡漾', model3dUrl: '', description: '湖水绿色如一泓清泉，清新怡人', material: '和田玉青海料', origin: '青海', stock: 70 },
      { id: 'hsl3', name: '湖水绿·翠微', size: '10mm', price: 4.80, weight: 1.2, color: '#5D9B7B', colorGroup: '湖水绿', category: '主珠', img: '', meaning: '翠微山色，碧波荡漾', model3dUrl: '', description: '湖水绿色如一泓清泉，清新怡人', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'hsl4', name: '湖水绿·碧潭', size: '8mm', price: 4.20, weight: 0.9, color: '#4D8B6B', colorGroup: '湖水绿', category: '主珠', img: '', meaning: '碧潭深幽，静水深流', model3dUrl: '', description: '深湖水绿如碧潭千尺，沉稳大气', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'hsl5', name: '湖水绿·碧潭', size: '10mm', price: 5.50, weight: 1.3, color: '#4D8B6B', colorGroup: '湖水绿', category: '主珠', img: '', meaning: '碧潭深幽，静水深流', model3dUrl: '', description: '深湖水绿如碧潭千尺，沉稳大气', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'hsl6', name: '湖水绿·碧潭', size: '12mm', price: 6.50, weight: 1.7, color: '#4D8B6B', colorGroup: '湖水绿', category: '主珠', img: '', meaning: '碧潭深幽，静水深流', model3dUrl: '', description: '深湖水绿如碧潭千尺，沉稳大气', material: '和田玉青海料', origin: '青海', stock: 40 }
    ],
    '糖玉': [
      { id: 'ty1', name: '糖玉·焦糖', size: '6mm', price: 2.90, weight: 0.5, color: '#C4A070', colorGroup: '糖玉', category: '主珠', img: '', meaning: '焦糖醇厚，岁月沉淀', model3dUrl: '', description: '糖玉质地，焦糖色调浓郁温润', material: '和田玉青海料', origin: '青海', stock: 70 },
      { id: 'ty2', name: '糖玉·焦糖', size: '8mm', price: 3.60, weight: 0.8, color: '#C4A070', colorGroup: '糖玉', category: '主珠', img: '', meaning: '焦糖醇厚，岁月沉淀', model3dUrl: '', description: '糖玉质地，焦糖色调浓郁温润', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'ty3', name: '糖玉·焦糖', size: '10mm', price: 5.00, weight: 1.2, color: '#C4A070', colorGroup: '糖玉', category: '主珠', img: '', meaning: '焦糖醇厚，岁月沉淀', model3dUrl: '', description: '糖玉质地，焦糖色调浓郁温润', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'ty4', name: '糖玉·蜜糖', size: '8mm', price: 4.50, weight: 0.8, color: '#D4B896', colorGroup: '糖玉', category: '主珠', img: '', meaning: '蜜糖甘甜，幸福美满', model3dUrl: '', description: '糖玉浅糖色，如蜜糖般甜美温润', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'ty5', name: '糖玉·蜜糖', size: '10mm', price: 5.80, weight: 1.2, color: '#D4B896', colorGroup: '糖玉', category: '主珠', img: '', meaning: '蜜糖甘甜，幸福美满', model3dUrl: '', description: '糖玉浅糖色，如蜜糖般甜美温润', material: '和田玉青海料', origin: '青海', stock: 50 }
    ],
    '青花': [
      { id: 'qh1', name: '青花·墨韵', size: '8mm', price: 6.80, weight: 0.9, color: '#7B8A9A', colorGroup: '青花', category: '主珠', img: '', meaning: '墨韵天成，青花如画', model3dUrl: '', description: '青花玉料，黑白交融如水墨丹青', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'qh2', name: '青花·墨韵', size: '10mm', price: 8.50, weight: 1.2, color: '#7B8A9A', colorGroup: '青花', category: '主珠', img: '', meaning: '墨韵天成，青花如画', model3dUrl: '', description: '青花玉料，黑白交融如水墨丹青', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'qh3', name: '青花·云烟', size: '8mm', price: 7.20, weight: 0.9, color: '#8B9AAA', colorGroup: '青花', category: '主珠', img: '', meaning: '云烟过眼，青山依旧', model3dUrl: '', description: '淡青花色如云雾缭绕山间', material: '和田玉青海料', origin: '青海', stock: 45 },
      { id: 'qh4', name: '青花·云烟', size: '10mm', price: 9.00, weight: 1.2, color: '#8B9AAA', colorGroup: '青花', category: '主珠', img: '', meaning: '云烟过眼，青山依旧', model3dUrl: '', description: '淡青花色如云雾缭绕山间', material: '和田玉青海料', origin: '青海', stock: 35 },
      { id: 'qh5', name: '青花·水墨', size: '6mm', price: 5.50, weight: 0.5, color: '#6B7A8A', colorGroup: '青花', category: '主珠', img: '', meaning: '水墨淋漓，意境深远', model3dUrl: '', description: '浓淡相宜如水墨画境', material: '和田玉青海料', origin: '青海', stock: 55 },
      { id: 'qh6', name: '青花·水墨', size: '8mm', price: 7.80, weight: 0.9, color: '#6B7A8A', colorGroup: '青花', category: '主珠', img: '', meaning: '水墨淋漓，意境深远', model3dUrl: '', description: '浓淡相宜如水墨画境', material: '和田玉青海料', origin: '青海', stock: 45 }
    ],
    '墨玉': [
      { id: 'my1', name: '墨玉·玄夜', size: '6mm', price: 3.20, weight: 0.5, color: '#1E1E1E', colorGroup: '墨玉', category: '主珠', img: '', meaning: '玄夜深沉，内蕴光华', model3dUrl: '', description: '墨玉纯黑如玄夜，沉稳内敛', material: '和田玉青海料', origin: '青海', stock: 80 },
      { id: 'my2', name: '墨玉·玄夜', size: '8mm', price: 4.00, weight: 0.8, color: '#1E1E1E', colorGroup: '墨玉', category: '主珠', img: '', meaning: '玄夜深沉，内蕴光华', model3dUrl: '', description: '墨玉纯黑如玄夜，沉稳内敛', material: '和田玉青海料', origin: '青海', stock: 70 },
      { id: 'my3', name: '墨玉·玄夜', size: '10mm', price: 5.60, weight: 1.2, color: '#1E1E1E', colorGroup: '墨玉', category: '主珠', img: '', meaning: '玄夜深沉，内蕴光华', model3dUrl: '', description: '墨玉纯黑如玄夜，沉稳内敛', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'my4', name: '墨玉·乌金', size: '8mm', price: 5.50, weight: 0.9, color: '#0D0D0D', colorGroup: '墨玉', category: '主珠', img: '', meaning: '乌金如墨，气韵非凡', model3dUrl: '', description: '墨玉乌金色，光泽内敛如乌金', material: '和田玉青海料', origin: '青海', stock: 55 },
      { id: 'my5', name: '墨玉·乌金', size: '12mm', price: 7.50, weight: 1.8, color: '#0D0D0D', colorGroup: '墨玉', category: '主珠', img: '', meaning: '乌金如墨，气韵非凡', model3dUrl: '', description: '墨玉乌金色，光泽内敛如乌金', material: '和田玉青海料', origin: '青海', stock: 40 }
    ],
    '碧玉': [
      { id: 'by1', name: '碧玉·翠浓', size: '6mm', price: 4.50, weight: 0.5, color: '#4A7A3A', colorGroup: '碧玉', category: '主珠', img: '', meaning: '翠色浓郁，生机勃勃', model3dUrl: '', description: '碧玉菠菜绿，翠色浓郁饱满', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'by2', name: '碧玉·翠浓', size: '8mm', price: 5.80, weight: 0.8, color: '#4A7A3A', colorGroup: '碧玉', category: '主珠', img: '', meaning: '翠色浓郁，生机勃勃', model3dUrl: '', description: '碧玉菠菜绿，翠色浓郁饱满', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'by3', name: '碧玉·翠浓', size: '10mm', price: 7.50, weight: 1.2, color: '#4A7A3A', colorGroup: '碧玉', category: '主珠', img: '', meaning: '翠色浓郁，生机勃勃', model3dUrl: '', description: '碧玉菠菜绿，翠色浓郁饱满', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'by4', name: '碧玉·松绿', size: '8mm', price: 6.50, weight: 0.8, color: '#3D6B32', colorGroup: '碧玉', category: '主珠', img: '', meaning: '松绿长青，岁寒不凋', model3dUrl: '', description: '碧玉松绿色，如苍松翠柏', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'by5', name: '碧玉·松绿', size: '10mm', price: 8.00, weight: 1.2, color: '#3D6B32', colorGroup: '碧玉', category: '主珠', img: '', meaning: '松绿长青，岁寒不凋', model3dUrl: '', description: '碧玉松绿色，如苍松翠柏', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'by6', name: '碧玉·菠菜绿', size: '8mm', price: 7.00, weight: 0.9, color: '#3A6A2D', colorGroup: '碧玉', category: '主珠', img: '', meaning: '青翠欲滴，自然之美', model3dUrl: '', description: '碧玉菠菜绿，如嫩菠菜般鲜翠', material: '和田玉青海料', origin: '青海', stock: 45 },
      { id: 'by7', name: '碧玉·菠菜绿', size: '10mm', price: 9.00, weight: 1.3, color: '#3A6A2D', colorGroup: '碧玉', category: '主珠', img: '', meaning: '青翠欲滴，自然之美', model3dUrl: '', description: '碧玉菠菜绿，如嫩菠菜般鲜翠', material: '和田玉青海料', origin: '青海', stock: 35 }
    ],
    '黄口': [
      { id: 'hk1', name: '黄口·鹅黄', size: '6mm', price: 6.80, weight: 0.5, color: '#E8D080', colorGroup: '黄口', category: '主珠', img: '', meaning: '鹅黄嫩绿，春意初生', model3dUrl: '', description: '黄口料浅黄色，如初春鹅黄', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'hk2', name: '黄口·鹅黄', size: '8mm', price: 8.50, weight: 0.8, color: '#E8D080', colorGroup: '黄口', category: '主珠', img: '', meaning: '鹅黄嫩绿，春意初生', model3dUrl: '', description: '黄口料浅黄色，如初春鹅黄', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'hk3', name: '黄口·鹅黄', size: '10mm', price: 10.50, weight: 1.2, color: '#E8D080', colorGroup: '黄口', category: '主珠', img: '', meaning: '鹅黄嫩绿，春意初生', model3dUrl: '', description: '黄口料浅黄色，如初春鹅黄', material: '和田玉青海料', origin: '青海', stock: 40 },
      { id: 'hk4', name: '黄口·蜜蜡', size: '8mm', price: 9.00, weight: 0.8, color: '#D4A04A', colorGroup: '黄口', category: '主珠', img: '', meaning: '蜜蜡温润，岁月留香', model3dUrl: '', description: '黄口料蜜蜡色，温润如蜜', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'hk5', name: '黄口·蜜蜡', size: '10mm', price: 11.00, weight: 1.2, color: '#D4A04A', colorGroup: '黄口', category: '主珠', img: '', meaning: '蜜蜡温润，岁月留香', model3dUrl: '', description: '黄口料蜜蜡色，温润如蜜', material: '和田玉青海料', origin: '青海', stock: 40 }
    ],
    '且末蓝': [
      { id: 'qml1', name: '且末蓝·苍穹', size: '8mm', price: 8.00, weight: 1.0, color: '#6B8FA3', colorGroup: '且末蓝', category: '主珠', img: '', meaning: '苍穹辽阔，志存高远', model3dUrl: '', description: '且末蓝料，如苍穹般开阔辽远', material: '和田玉青海料', origin: '青海', stock: 60 },
      { id: 'qml2', name: '且末蓝·苍穹', size: '10mm', price: 12.00, weight: 1.3, color: '#6B8FA3', colorGroup: '且末蓝', category: '主珠', img: '', meaning: '苍穹辽阔，志存高远', model3dUrl: '', description: '且末蓝料，如苍穹般开阔辽远', material: '和田玉青海料', origin: '青海', stock: 50 },
      { id: 'qml3', name: '且末蓝·冰蓝', size: '8mm', price: 9.50, weight: 1.0, color: '#8BAAAA', colorGroup: '且末蓝', category: '主珠', img: '', meaning: '冰蓝剔透，清冷如霜', model3dUrl: '', description: '且末蓝冰蓝色，清透如冰晶', material: '和田玉青海料', origin: '青海', stock: 55 },
      { id: 'qml4', name: '且末蓝·冰蓝', size: '10mm', price: 13.00, weight: 1.3, color: '#8BAAAA', colorGroup: '且末蓝', category: '主珠', img: '', meaning: '冰蓝剔透，清冷如霜', model3dUrl: '', description: '且末蓝冰蓝色，清透如冰晶', material: '和田玉青海料', origin: '青海', stock: 45 }
    ]
  },
  '配饰': {
    '白色系': [
      { id: 'ac1', name: '银隔片', size: '3mm', price: 2.00, weight: 0.2, color: '#d4d4d4', colorGroup: '白色系', category: '配饰', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 },
      { id: 'ac2', name: '珍珠隔珠', size: '4mm', price: 5.00, weight: 0.3, color: '#f5f0eb', colorGroup: '白色系', category: '配饰', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 }
    ],
    '红色系': [
      { id: 'ac5', name: '南红玛瑙', size: '6mm', price: 12.00, weight: 0.7, color: '#c0392b', colorGroup: '红色系', category: '配饰', img: '', meaning: '红运当头，吉祥如意', model3dUrl: '', description: '', material: '南红玛瑙', origin: '四川凉山', stock: 0 },
      { id: 'ac6', name: '南红玛瑙', size: '8mm', price: 18.00, weight: 1.0, color: '#a93226', colorGroup: '红色系', category: '配饰', img: '', meaning: '红运当头，吉祥如意', model3dUrl: '', description: '', material: '南红玛瑙', origin: '四川凉山', stock: 0 },
      { id: 'ac7', name: '红石榴', size: '6mm', price: 8.00, weight: 0.6, color: '#d4456a', colorGroup: '红色系', category: '配饰', img: '', meaning: '石榴多籽，多子多福', model3dUrl: '', description: '', material: '石榴石', origin: '', stock: 0 },
      { id: 'ac8', name: '红石榴', size: '8mm', price: 12.00, weight: 0.9, color: '#d4456a', colorGroup: '红色系', category: '配饰', img: '', meaning: '石榴多籽，多子多福', model3dUrl: '', description: '', material: '石榴石', origin: '', stock: 0 }
    ],
    '黄色系': [
      { id: 'ac3', name: '金隔片', size: '3mm', price: 3.00, weight: 0.3, color: '#d4a04a', colorGroup: '黄色系', category: '配饰', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 },
      { id: 'ac4', name: '金花托', size: '5mm', price: 4.00, weight: 0.4, color: '#d4a04a', colorGroup: '黄色系', category: '配饰', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 },
      { id: 'ac9', name: '蜜蜡', size: '8mm', price: 28.00, weight: 0.6, color: '#e8b86d', colorGroup: '黄色系', category: '配饰', img: '', meaning: '蜜蜡温润，时光沉淀', model3dUrl: '', description: '', material: '天然蜜蜡', origin: '', stock: 0 },
      { id: 'ac10', name: '蜜蜡', size: '10mm', price: 38.00, weight: 0.9, color: '#d4a04a', colorGroup: '黄色系', category: '配饰', img: '', meaning: '蜜蜡温润，时光沉淀', model3dUrl: '', description: '', material: '天然蜜蜡', origin: '', stock: 0 }
    ],
    '蓝色系': [
      { id: 'ac11', name: '青金石', size: '6mm', price: 14.00, weight: 0.8, color: '#4a6fa5', colorGroup: '蓝色系', category: '配饰', img: '', meaning: '智慧之石，明心见性', model3dUrl: '', description: '', material: '青金石', origin: '阿富汗', stock: 0 },
      { id: 'ac12', name: '青金石', size: '8mm', price: 20.00, weight: 1.2, color: '#3a5f95', colorGroup: '蓝色系', category: '配饰', img: '', meaning: '智慧之石，明心见性', model3dUrl: '', description: '', material: '青金石', origin: '阿富汗', stock: 0 }
    ]
  },
  '三通&吊坠': {
    '白色系': [
      { id: 'pd1', name: '白玉三通', size: '12mm', price: 18.00, weight: 2.5, color: '#f0ece8', colorGroup: '白色系', category: '三通&吊坠', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 }
    ],
    '紫色系': [
      { id: 'pd2', name: '烟紫三通', size: '12mm', price: 15.00, weight: 2.3, color: '#8b6ba5', colorGroup: '紫色系', category: '三通&吊坠', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 }
    ]
  },
  '隔片': {
    '咖色系': [
      { id: 'sp1', name: '皮质隔片', size: '2mm', price: 1.00, weight: 0.1, color: '#c4a886', colorGroup: '咖色系', category: '隔片', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 }
    ]
  },
  '绳子': {
    '白色系': [
      { id: 'rp1', name: '透明弹力绳', size: '0.5mm', price: 0.00, weight: 0.1, color: 'transparent', colorGroup: '白色系', category: '绳子', img: '', meaning: '', model3dUrl: '', description: '', material: '', origin: '', stock: 0 }
    ]
  }
};

// 分类列表
const beadCategories = ['主珠', '配饰', '三通&吊坠', '隔片', '绳子'];

// 色系列表 — 和田玉十大分类，按鉴赏顺序排列
const colorGroups = [
  { key: '羊脂白', label: '羊脂白', color: '#F0ECE8' },
  { key: '烟紫',   label: '烟紫',   color: '#7B5B95' },
  { key: '藕粉',   label: '藕粉',   color: '#E8C4C4' },
  { key: '湖水绿', label: '湖水绿', color: '#6B8F71' },
  { key: '糖玉',   label: '糖玉',   color: '#D4B896' },
  { key: '青花',   label: '青花',   color: '#7B8A9A' },
  { key: '墨玉',   label: '墨玉',   color: '#2D2D2D' },
  { key: '碧玉',   label: '碧玉',   color: '#4A7A3A' },
  { key: '黄口',   label: '黄口',   color: '#D4A04A' },
  { key: '且末蓝', label: '且末蓝', color: '#6B8FA3' }
];

// 设计图数据（玉牌用）
// 注意：img 留空，由后台管理上传；前端显示底色占位块
// 每个设计包含 meaning(寓意)、description(设计解释)、suitableAudience(适合人群)
const designData = {
  '山水': [
    {
      id: 'sj1', name: '富春山居',
      meaning: '隐居山林，悠然自得',
      img: '',
      description: '以元代黄公望《富春山居图》为灵感，描绘江南山水之秀美。层峦叠嶂间，江水蜿蜒，渔舟唱晚，茅舍隐于松竹之间，尽显文人雅士寄情山水、远离尘嚣的隐逸情怀。此设计以淡墨勾皴，层次分明，将中国山水画的气韵生动融入玉牌之中。',
      suitableAudience: '喜爱传统文化的收藏者、商务人士、寻求内心宁静的人'
    },
    {
      id: 'sj2', name: '黄山迎客松',
      meaning: '步步高升，基业长青',
      img: '',
      description: '取材安徽黄山迎客松意象，千年古松挺立于悬崖峭壁，枝干虬曲苍劲，如张开双臂迎接四方宾客。松为岁寒三友之首，象征坚韧不拔、基业长青。此设计以写实与写意结合，突出迎客松的精神气象，寓意事业高升、宾客盈门。',
      suitableAudience: '企业管理者、创业者、职场人士、希望事业进步的人'
    },
    {
      id: 'sj3', name: '漓江烟雨',
      meaning: '江南烟雨，柔情似水',
      img: '',
      description: '以桂林漓江山水为蓝本，烟雨朦胧中，群峰倒影江面，渔翁披蓑笠独钓，展现"江作青罗带，山如碧玉簪"的诗意画卷。此设计以柔美线条勾勒山形水韵，营造出如梦似幻的江南意境，寄托对美好生活的向往。',
      suitableAudience: '文艺爱好者、追求浪漫的人、喜爱自然风光之人'
    },
    {
      id: 'sj4', name: '泰山日出',
      meaning: '旭日东升，前程似锦',
      img: '',
      description: '以五岳之首泰山为题材，描绘旭日破晓于云海之上的壮丽景象。红日冉冉，云蒸霞蔚，山峦巍峨立于天地之间，尽显"会当凌绝顶，一览众山小"的豪迈气概。此设计气势磅礴，色彩浓烈，寓意前程似锦、蒸蒸日上。',
      suitableAudience: '企业家、即将开启新事业的人、追求成功的人士'
    }
  ],
  '龙凤': [
    {
      id: 'lf1', name: '九龙戏珠',
      meaning: '权势尊贵，吉祥如意',
      img: '',
      description: '九条神龙环绕宝珠而舞，取"九龙"至尊之数。龙腾云海，鳞爪飞扬，宝珠光芒四射，构图严谨中不失灵动。龙在中国文化中象征皇权与尊贵，九为阳数之极，此设计集祥瑞之大成，寓意至高无上、吉祥圆满。',
      suitableAudience: '企业高层、追求事业巅峰者、收藏级玩家'
    },
    {
      id: 'lf2', name: '凤舞九天',
      meaning: '高贵典雅，百鸟朝凤',
      img: '',
      description: '凤凰展翅于九天之上，羽翼华丽，体态优雅。凤为百鸟之王，象征高贵与美丽，五色备举，德被四方。此设计以流畅曲线勾勒凤姿，配以祥云环绕，体现出极致的东方美学韵味，寓意女性尊贵典雅、才德兼备。',
      suitableAudience: '女性收藏者、注重仪态优雅之人、传统文化爱好者'
    },
    {
      id: 'lf3', name: '龙凤呈祥',
      meaning: '婚姻美满，幸福长久',
      img: '',
      description: '龙与凤交相辉映，一刚一柔，阴阳和谐。龙腾凤舞间，祥云缭绕，瑞气氤氲，寓意天地交泰、万物和谐。此设计将中华婚庆文化中"龙凤配"的吉祥寓意完美呈现，构图精妙绝伦，是婚庆馈赠的上乘之选。',
      suitableAudience: '新婚夫妇、纪念日送礼者、追求家庭幸福之人'
    },
    {
      id: 'lf4', name: '龙腾四海',
      meaning: '事业腾飞，宏图大展',
      img: '',
      description: '一龙破浪腾空，翻江倒海，威震四方。龙角峥嵘，龙须飘洒，龙爪遒劲，尽显王者之气。此设计以动态构图突显龙的气势与力量，背景海浪翻涌增强视觉冲击力，寓意事业如龙腾四海、势不可挡。',
      suitableAudience: '创业者、企业家、渴望突破与变革的人'
    }
  ],
  '花鸟': [
    {
      id: 'hn1', name: '喜上眉梢',
      meaning: '喜事临门，好运将至',
      img: '',
      description: '喜鹊立于梅花枝头，"梅"谐音"眉"，"鹊"为喜鸟，合为"喜上眉梢"之吉意。梅花傲雪绽放，喜鹊灵动机敏，一静一动相得益彰。此设计以传统花鸟画技法和田玉为载体，构图疏密有致，传递出喜气洋洋的节日氛围。',
      suitableAudience: '期待好运的人、适合节庆送礼、生肖属鹊/梅相关人群'
    },
    {
      id: 'hn2', name: '花开富贵',
      meaning: '富贵吉祥，幸福美满',
      img: '',
      description: '牡丹国色天香，雍容华贵，被誉为"花中之王"。此设计以盛放牡丹为主体，花瓣层层叠叠，姿态饱满丰腴，配以蝴蝶翩翩、绿叶扶疏，营造出春意盎然、富贵满堂的华美景象。牡丹"花开富贵"之寓意深入人心，是祝福富贵吉祥的经典题材。',
      suitableAudience: '收藏爱好者、商务人士、祝寿送礼、追求生活品质之人'
    },
    {
      id: 'hn3', name: '梅兰竹菊',
      meaning: '四君子风，高洁雅致',
      img: '',
      description: '梅兰竹菊合称"四君子"，分别代表傲、幽、坚、淡四种品格。梅花傲霜斗雪，兰花幽香清远，竹子虚心有节，菊花淡泊明志。此设计将四君子巧妙布局于一牌之中，以文人画风表现君子之德，寄寓修身养性、志行高洁的人生追求。',
      suitableAudience: '文人雅士、教育从业者、追求精神修养之人'
    },
    {
      id: 'hn4', name: '鸳鸯戏水',
      meaning: '恩爱夫妻，白头偕老',
      img: '',
      description: '一对鸳鸯浮游于碧波之上，交颈相依，情意绵绵。水面涟漪微荡，荷叶田田，莲花并蒂，处处皆是恩爱之象。鸳鸯自古就是爱情的象征，"只羡鸳鸯不羡仙"道尽人间真情。此设计温婉雅致，寓意夫妻恩爱、天长地久。',
      suitableAudience: '情侣/夫妻、七夕/情人节送礼、追求美好爱情之人'
    }
  ]
};

const designCategories = ['山水', '龙凤', '花鸟'];
const sizeOptions = ['13', '14', '15', '16', '17', '18', '19', '20', '21'];
// 玉牌料子色系 — 与 colorGroups 顺序一致
const jadeColors = ['羊脂白', '烟紫', '藕粉', '湖水绿', '糖玉', '青花', '墨玉', '碧玉', '黄口', '且末蓝'];

module.exports = {
  beadData: beadData,
  designData: designData,
  beadCategories: beadCategories,
  colorGroups: colorGroups,
  designCategories: designCategories,
  sizeOptions: sizeOptions,
  jadeColors: jadeColors
};
