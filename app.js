const raw = window.BDO_CARRACK_DATA;
const storeKey = "bdo-carrack-planner-v1";

const state = {
  target: "advance",
  query: "",
  method: "all",
  status: "missing",
  timeBudget: 120,
  daysPerWeek: 5,
  tasksPerDay: 5,
  forumGroup: "all",
  processStep: "",
  owned: {},
};

const targetStage = {
  advance: "ทนทาน",
  balance: "สมดุล",
  volante: "ฉุกเฉิน",
  valor: "แข็งแกร่ง",
};

const methodRules = [
  ["daily", ["รายวัน", "ดวงตาแห่งโอคิลูอา", "ราบีเคลล์", "โอลด์มูน"]],
  ["barter", ["แลกเปลี่ยน", "Barter", "[ระดับ"]],
  ["crow", ["อีกาดำ", "Crow Coin", "ราวีเนีย"]],
  ["craft", ["ผลิต", "หลอม", "ตัดฟืน", "ตากแห้ง", "แปรรูป", "โรงผลิต"]],
  ["hunt", ["กำจัด", "ล่า", "สัตว์ประหลาด", "คานน์", "โจรสลัด"]],
  ["buy", ["ซื้อ", "ตลาดซื้อขาย", "พัลลาซี"]],
];

const methodNames = {
  daily: "เควสรายวัน",
  barter: "แลกเปลี่ยนทะเล",
  crow: "ร้านค้าอีกาดำ",
  craft: "ผลิต/แปรรูป",
  hunt: "ล่าทะเล",
  buy: "ซื้อ/ตลาด",
};

const searchAliases = {
  crow: ["อีกาดำ", "เหรียญอีกาดำ", "เหรียญตราอีกาดำ", "ราวีเนีย"],
  ravinia: ["ราวีเนีย", "อีกาดำ"],
  chiro: ["ชีโล่", "อุปกรณ์คาแร็ค"],
  carrack: ["คาแร็ค", "เรือคาร์แร็ค"],
  caravel: ["เรือการค้า"],
  galleass: ["เรือแกลลีย์"],
  daily: ["รายวัน", "เควสรายวัน"],
  barter: ["แลกเปลี่ยน", "เทรด", "ทะเล"],
  craft: ["ผลิต", "แปรรูป", "หลอม", "ตัดฟืน", "ตากแห้ง"],
  trade: ["แลกเปลี่ยน", "เทรด", "เรือการค้า"],
  "+10": ["เสริมประสิทธิภาพ", "ตีบวก", "+10"],
};

const crowCoinPriceRules = [
  ["กาวที่มีความทรงจำของทะเลลึก", 800],
  ["ลำต้นพืชทะเลลึก", 600],
  ["ผ้าลินินที่มีเส้นเลือดของพระจันทร์สลักอยู่", 600],
  ["ไม้แปรรูปที่ประกายแสงสีครามเข้ม", 600],
  ["แท่งเหล็กหินเกลือเจิดจรัส", 1600],
  ["อัญมณีมุกเจิดจรัส", 1600],
  ["น้ำตาแห่งทะเลลึก", 3900],
  ["เหล็กแห่งมหาสมุทรที่แข็งแกร่ง", 160],
  ["ไม้อัดเกล็ดพระจันทร์", 160],
  ["อัญมณีมุกที่บริสุทธิ์", 550],
  ["แท่งทองสีโคบอลต์เปร่งประกาย", 800],
  ["แท่งทองสีโคบอลต์", 150],
  ["วัตถุโบราณของโจรสลัดค็อกซ์ (ต่อสู้)", 800],
  ["วัตถุโบราณของโจรสลัดค็อกซ์ (การเจรจาระดับสูง)", 800],
  ["วัตถุโบราณของกลุ่มโจรสลัดค็อกซ์ (ต่อสู้)", 800],
  ["วัตถุโบราณของกลุ่มโจรสลัดค็อกซ์ (การเจรจาระดับสูง)", 800],
  ["ชิ้นส่วนหินโสโครกกระจ่างใส", 140],
  ["ไม้อัดต้นเกาะเสริมประสิทธิภาพ", 80],
  ["แร่ใต้มหาสมุทรสีเลือดฝาด", 1600],
  ["+10 เรือคาร์แร็คเอเฟเรีย", 10000],
  ["ไม้อัดคลื่นทะเลรุนแรง", 1000],
  ["เสารองรับที่ประณีต", 1000],
  ["กาวที่มีร่องรอยของคลื่นทะเล", 1000],
];

const ingredientImages = {
  ปะการังสีดำ: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004482.webp",
  ปะการังสีฟ้า: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004477.webp",
  ปะการังสีแดงรุ่งอรุณ: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004478.webp",
  ปะการังสีฟ้าเวหา: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004479.webp",
  ปะการังหลากสี: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004483.webp",
  ชิ้นส่วนปะการังหลากสี: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004483.webp",
  ปะการังล้ำค่า: "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00004483.webp",
};

const forumGroupNames = {
  overview: "ภาพรวม",
  "ship-type": "ประเภทเรือ",
  materials: "วัตถุดิบ",
  gear: "อุปกรณ์เรือ",
  enhance: "ตีบวก",
  barter: "เทรดทะเล",
  location: "ตำแหน่ง/NPC",
  currency: "เหรียญ/ใบแลก",
  "upgrade-ui": "หน้าต่างต่อเติม",
  hunt: "ล่าทะเล",
  tip: "ทิป",
  reference: "อื่น ๆ",
};

const routePlans = {
  advance: [
    { title: "มีใบลงทะเบียนเรือสำเภาเอเฟเรีย", match: ["ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย"] },
    { title: "ทำหรือข้ามเรือสำเภาดัดแปลง", match: ["ดัดแปลง"] },
    { title: "อัปเป็นเรือการค้าเอเฟเรีย", match: ["เรือการค้าเอเฟเรีย"] },
    { title: "ทำอุปกรณ์เรือการค้า +10", match: ["+10 เรือการค้าเอเฟเรีย"] },
    { title: "สะสมวัสดุคาแร็คทนทาน", match: ["ทนทาน"] },
  ],
  balance: [
    { title: "มีใบลงทะเบียนเรือสำเภาเอเฟเรีย", match: ["ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย"] },
    { title: "ทำหรือข้ามเรือสำเภาดัดแปลง", match: ["ดัดแปลง"] },
    { title: "อัปเป็นเรือการค้าเอเฟเรีย", match: ["เรือการค้าเอเฟเรีย"] },
    { title: "ทำอุปกรณ์เรือการค้า +10", match: ["+10 เรือการค้าเอเฟเรีย"] },
    { title: "สะสมวัสดุคาแร็คสมดุล", match: ["สมดุล"] },
  ],
  volante: [
    { title: "มีใบลงทะเบียนเรือฟริเกตเอเฟเรีย", match: ["ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย"] },
    { title: "ทำหรือข้ามเรือฟริเกตดัดแปลง", match: ["ดัดแปลง"] },
    { title: "อัปเป็นเรือแกลลีย์เอเฟเรีย", match: ["เรือแกลลีย์เอเฟเรีย"] },
    { title: "ทำอุปกรณ์เรือแกลลีย์ +10", match: ["+10 เรือแกลลีย์เอเฟเรีย"] },
    { title: "สะสมวัสดุคาแร็คฉุกเฉิน", match: ["ฉุกเฉิน"] },
  ],
  valor: [
    { title: "มีใบลงทะเบียนเรือฟริเกตเอเฟเรีย", match: ["ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย"] },
    { title: "ทำหรือข้ามเรือฟริเกตดัดแปลง", match: ["ดัดแปลง"] },
    { title: "อัปเป็นเรือแกลลีย์เอเฟเรีย", match: ["เรือแกลลีย์เอเฟเรีย"] },
    { title: "ทำอุปกรณ์เรือแกลลีย์ +10", match: ["+10 เรือแกลลีย์เอเฟเรีย"] },
    { title: "สะสมวัสดุคาแร็คแข็งแกร่ง", match: ["แข็งแกร่ง"] },
  ],
};

const processPlans = {
  advance: [
    { id: "start", title: "1. เตรียมเรือสำเภาเอเฟเรีย", words: ["ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย"], note: "เริ่มจากใบลงทะเบียนเรือสำเภาเอเฟเรีย แล้วจอดที่ท่าเรือเพื่อเตรียมต่อเติม" },
    { id: "improved", title: "2. เสริมเป็นเรือสำเภาดัดแปลง (ทางเลือก)", words: ["เสริมทางเลือก"], note: "ช่วยยิงปืนใหญ่จากพวงมาลัย ทำให้ล่ามอนทะเลสะดวกขึ้น แต่ถ้าของพร้อมสามารถข้ามไปเรือการค้าได้" },
    { id: "caravel", title: "3. อัปเรือสำเภา → เรือการค้า", words: ["เรือสำเภาเอเฟเรีย / ดัดแปลง → เรือการค้าเอเฟเรีย"], note: "โฟกัสใบอนุญาตเรือการค้า, อุปกรณ์เก่า +10, วัตถุดิบต่อเติม และของจากเทรดทะเล/ราวีเนีย" },
    { id: "caravel-gear", title: "4. ทำอุปกรณ์/ประดับเรือการค้า", words: ["อุปกรณ์เรือการค้า", "+10 เรือการค้าเอเฟเรีย"], note: "ทำอุปกรณ์สีเขียว/สีฟ้าและตีเป็น +10 เพื่อใช้ต่อคาแร็ค ขั้นนี้มีทั้งซื้อพัลลาซี ผลิตโรงเรือ และใช้หินดำอบอุ่น/เยือกเย็น" },
    { id: "carrack", title: "5. สะสมวัสดุคาแร็คทนทาน", words: ["เรือการค้าเอเฟเรีย → เรือคาร์แร็คเอเฟเรีย - ทนทาน", "เรือการค้าเอเฟเรีย → เรือคาร์แร็คเอเฟเรีย : ทนทาน"], note: "เน้นของรายวัน น้ำตาแห่งทะเลลึก ของเจิดจรัส และวัสดุระดับ 5 จากเทรดทะเล" },
    { id: "chiro", title: "6. อุปกรณ์คาแร็คของชีโล่", words: ["อุปกรณ์คาแร็ค"], note: "หลังมีคาแร็คแล้วค่อยไล่แผนผังชีโล่ ไม้อัดคลื่นทะเลรุนแรง เสารองรับ และกาวคลื่นทะเล" },
  ],
  balance: [
    { id: "start", title: "1. เตรียมเรือสำเภาเอเฟเรีย", words: ["ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย"], note: "เริ่มจากใบลงทะเบียนเรือสำเภาเอเฟเรีย แล้วจอดที่ท่าเรือเพื่อเตรียมต่อเติม" },
    { id: "improved", title: "2. เสริมเป็นเรือสำเภาดัดแปลง (ทางเลือก)", words: ["เสริมทางเลือก"], note: "ช่วยยิงปืนใหญ่จากพวงมาลัย ทำให้ล่ามอนทะเลสะดวกขึ้น" },
    { id: "caravel", title: "3. อัปเรือสำเภา → เรือการค้า", words: ["เรือสำเภาเอเฟเรีย / ดัดแปลง → เรือการค้าเอเฟเรีย"], note: "รายการเดียวกับสายทนทาน เพราะทั้งคู่ต่อจากเรือการค้า" },
    { id: "caravel-gear", title: "4. ทำอุปกรณ์/ประดับเรือการค้า", words: ["อุปกรณ์เรือการค้า", "+10 เรือการค้าเอเฟเรีย"], note: "เตรียมอุปกรณ์ +10 ให้ตรงเงื่อนไขก่อนขึ้นคาแร็ค" },
    { id: "carrack", title: "5. สะสมวัสดุคาแร็คสมดุล", words: ["เรือการค้าเอเฟเรีย → เรือคาร์แร็คเอเฟเรีย - สมดุล", "เรือการค้าเอเฟเรีย → เรือคาร์แร็คเอเฟเรีย : สมดุล"], note: "สายสมดุลใช้น้ำตาแห่งทะเลลึกมากกว่าทนทาน จัดเป็นคอขวดหลัก" },
    { id: "chiro", title: "6. อุปกรณ์คาแร็คของชีโล่", words: ["อุปกรณ์คาแร็ค"], note: "ขั้นหลังมีคาแร็ค เน้นแผนผัง/วัสดุรุนแรงจากทะเลและราวีเนีย" },
  ],
  volante: [
    { id: "start", title: "1. เตรียมเรือฟริเกตเอเฟเรีย", words: ["ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย"], note: "เริ่มจากใบลงทะเบียนเรือฟริเกตเอเฟเรียสำหรับสายรบ" },
    { id: "galleass", title: "2. อัปฟริเกต → เรือแกลลีย์", words: ["เรือฟริเกตเอเฟเรีย → เรือแกลลีย์เอเฟเรีย"], note: "ใช้ชุดวัตถุดิบคล้ายเรือการค้า แต่เพิ่มวัสดุสายรบและของเทรดทะเลบางชุด" },
    { id: "galleass-gear", title: "3. ทำอุปกรณ์/ประดับเรือแกลลีย์", words: ["อุปกรณ์เรือแกลลีย์", "+10 เรือแกลลีย์เอเฟเรีย"], note: "ผลิตอุปกรณ์เรือแกลลีย์และตี +10 ก่อนต่อคาแร็คสายรบ" },
    { id: "carrack", title: "4. สะสมวัสดุคาแร็คฉุกเฉิน", words: ["เรือแกลลีย์เอเฟเรีย → เรือคาร์แร็คเอเฟเรีย : ฉุกเฉิน"], note: "เน้นความเร็ว ใช้วัสดุรายวัน/เทรดทะเลและของ Cox หลายรายการ" },
    { id: "chiro", title: "5. อุปกรณ์คาแร็คของชีโล่", words: ["อุปกรณ์คาแร็ค"], note: "ทำอุปกรณ์หลังมีคาแร็คแล้ว" },
  ],
  valor: [
    { id: "start", title: "1. เตรียมเรือฟริเกตเอเฟเรีย", words: ["ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย"], note: "เริ่มจากใบลงทะเบียนเรือฟริเกตเอเฟเรียสำหรับสายรบ" },
    { id: "galleass", title: "2. อัปฟริเกต → เรือแกลลีย์", words: ["เรือฟริเกตเอเฟเรีย → เรือแกลลีย์เอเฟเรีย"], note: "ทำวัตถุดิบเพื่อขึ้นเรือแกลลีย์ก่อน" },
    { id: "galleass-gear", title: "3. ทำอุปกรณ์/ประดับเรือแกลลีย์", words: ["อุปกรณ์เรือแกลลีย์", "+10 เรือแกลลีย์เอเฟเรีย"], note: "ผลิตอุปกรณ์เรือแกลลีย์และตี +10 ก่อนต่อคาแร็คสายรบ" },
    { id: "carrack", title: "4. สะสมวัสดุคาแร็คแข็งแกร่ง", words: ["เรือแกลลีย์เอเฟเรีย → เรือคาร์แร็คเอเฟเรีย : แข็งแกร่ง"], note: "เน้นสายยิง ใช้ของ Cox/เทรดทะเล/รายวันเป็นหลัก" },
    { id: "chiro", title: "5. อุปกรณ์คาแร็คของชีโล่", words: ["อุปกรณ์คาแร็ค"], note: "ทำอุปกรณ์หลังมีคาแร็คแล้ว" },
  ],
};

const shipTargets = {
  advance: {
    label: "ทนทาน",
    title: "คาร์แร็ค - ทนทาน",
    tag: "สายการค้า",
    symbol: "หัวม้า",
    image: "https://s1.pearlcdn.com/KR/Upload/WIKI/443537d040b20220616133228895.png",
    position: "0 100%",
    heroPosition: "0 82%",
    size: "200% auto",
    focus: "น้ำหนักบรรทุกสูง เหมาะกับเทรดทะเลและทำเงิน",
  },
  balance: {
    label: "สมดุล",
    title: "คาร์แร็ค - สมดุล",
    tag: "บาลานซ์",
    symbol: "หัวกวาง",
    image: "https://s1.pearlcdn.com/KR/Upload/WIKI/443537d040b20220616133228895.png",
    position: "0 0",
    heroPosition: "0 6%",
    size: "200% auto",
    focus: "ค่าสถานะกลาง ๆ แต่ใช้น้ำตาแห่งทะเลลึกเยอะกว่า",
  },
  volante: {
    label: "ฉุกเฉิน",
    title: "คาร์แร็ค - ฉุกเฉิน",
    tag: "สายเร็ว",
    symbol: "หัวนก",
    image: "https://s1.pearlcdn.com/KR/Upload/WIKI/443537d040b20220616133228895.png",
    position: "100% 0",
    heroPosition: "100% 6%",
    size: "200% auto",
    focus: "ความเร็วสูง ต่อจากเรือแกลลีย์ เหมาะกับวิ่งงานไว",
  },
  valor: {
    label: "แข็งแกร่ง",
    title: "คาร์แร็ค - แข็งแกร่ง",
    tag: "สายรบ",
    symbol: "หัวสิงโต",
    image: "https://s1.pearlcdn.com/KR/Upload/WIKI/443537d040b20220616133228895.png",
    position: "100% 100%",
    heroPosition: "100% 82%",
    size: "200% auto",
    focus: "พลังยิงสูง ต่อจากเรือแกลลีย์ เหมาะกับล่ามอนทะเล",
  },
  all: {
    label: "รวม",
    title: "ดูรวมทุกสาย",
    tag: "ภาพรวม",
    symbol: "แผนผัง",
    image: "https://s1.pearlcdn.com/TH/Upload/Community/4304f167e1420200624122038477.jpg",
    position: "center",
    size: "cover",
    focus: "รวมข้อมูลทุกสายเพื่อเช็กของทั้งหมดในภาพเดียว",
  },
};

const fallbackImages = {
  start: "https://s1.pearlcdn.com/TH/Upload/Community/b86e9837ac420191118111703871.jpg",
  caravel: "https://s1.pearlcdn.com/TH/Upload/Community/d9ef8d1145120191118112645908.jpg",
  galleass: "https://s1.pearlcdn.com/TH/Upload/Community/d9ef8d1145120191118112645908.jpg",
  carrackTrade: "https://s1.pearlcdn.com/TH/Upload/Community/a40fb36c01420230707104722331.jpg",
  carrackCombat: "https://s1.pearlcdn.com/TH/Upload/Community/e8735003c5220230707104742338.jpg",
  gear: "https://s1.pearlcdn.com/TH/Upload/Community/775df87a80020191118143502793.jpg",
  material: "",
};

const recipeRules = [
  {
    match: "แท่งโลหะควันมืดต่อเติม",
    chips: ["ของเหลวสัตว์ประหลาดทะเล", "แท่งสังกะสี", "หลอม"],
  },
  {
    match: "ไม้สำหรับต่อเติม",
    chips: ["ของเหลวสัตว์ประหลาดทะเล", "ตอไม้สีแดง", "เปลือกไม้เก่าแก่", "ตัดฟืน"],
  },
  {
    match: "กาวสำหรับต่อเติม",
    chips: ["ของเหลวสัตว์ประหลาดทะเล", "ยางไม้ซีดาร์ขาว", "ยางไม้อะคาเซีย", "ยางไม้เอลเดอร์", "หลอม"],
  },
  {
    match: "ไม้แปรรูปที่ประกายแสงสีครามเข้ม",
    chips: ["สะเก็ดเรือโจรสลัดที่ใช้ได้", "ตัดฟืน"],
  },
  {
    match: "ผ้าลินินที่มีเส้นเลือดของพระจันทร์สลักอยู่",
    chips: ["เอ็นของคานน์", "ตากแห้ง"],
  },
  {
    match: "กาวที่มีความทรงจำของทะเลลึก",
    chips: ["แลกเปลี่ยนระดับ 3", "ร้านค้าอีกาดำ", "รายวันราบีเคลล์"],
  },
  {
    match: "ลำต้นพืชทะเลลึก",
    chips: ["ร้านค้าอีกาดำ", "ปะการังล้ำค่า", "รายวัน"],
  },
  {
    match: "น้ำตาแห่งทะเลลึก",
    chips: ["แลกเปลี่ยนระดับ 5", "ร้านค้าอีกาดำ", "เควสรายวัน", "คอขวดหลัก"],
  },
  {
    match: "แท่งเหล็กหินเกลือเจิดจรัส",
    chips: ["แลกเปลี่ยนระดับ 5", "ร้านค้าอีกาดำ"],
  },
  {
    match: "อัญมณีมุกเจิดจรัส",
    chips: ["แลกเปลี่ยนระดับ 5", "ร้านค้าอีกาดำ"],
  },
  {
    match: "แผนผัง : หัวเรือของชีโล่",
    chips: ["คนงาน", "ฐานเกาะทินเบรา", "โรงผลิตชิ้นส่วนเรือของชีโล่ เกาะอิลียา บ้านเลขที่ 3"],
  },
  {
    match: "แผนผัง : ใบเรือของชีโล่",
    chips: ["คนงาน", "ฐานเกาะราซิดด์", "โรงผลิตชิ้นส่วนเรือของชีโล่ เกาะอิลียา บ้านเลขที่ 3"],
  },
  {
    match: "แผนผัง : ปืนใหญ่ของชีโล่",
    chips: ["คนงาน", "ฐานเกาะอัลนาฮา", "โรงผลิตชิ้นส่วนเรือของชีโล่ เกาะอิลียา บ้านเลขที่ 3"],
  },
  {
    match: "แผนผัง : หุ้มเกราะดำของชีโล่",
    chips: ["คนงาน", "ฐานเกาะเลราโอ", "โรงผลิตชิ้นส่วนเรือของชีโล่ เกาะอิลียา บ้านเลขที่ 3"],
  },
  {
    match: "ไม้อัดคลื่นทะเลรุนแรง",
    chips: ["เกล็ดสัตว์ประหลาดทะเลรุนแรง", "เกล็ดจระเข้ทะเล", "ผลิต", "หรือซื้อราวีเนีย"],
  },
  {
    match: "เสารองรับที่ประณีต",
    chips: ["กระดูกสัตว์ประหลาดทะเลรุนแรง", "น้ำยาเสริมความแข็งแกร่งแสงดาว", "ผลิต", "หรือซื้อราวีเนีย"],
  },
  {
    match: "กาวที่มีร่องรอยของคลื่นทะเล",
    chips: ["ของเหลวสัตว์ประหลาดทะเลรุนแรง", "น้ำยาเสริมความอ่อนโยนแสงดาว", "แปรธาตุอย่างง่าย", "หรือซื้อราวีเนีย"],
  },
];

function loadState() {
  const saved = localStorage.getItem(storeKey);
  if (!saved) return;
  try {
    Object.assign(state, JSON.parse(saved));
  } catch {
    localStorage.removeItem(storeKey);
  }
}

function saveState() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function itemOwned(item) {
  return Number(state.owned[item.id] ?? item.owned ?? 0);
}

function itemMissing(item) {
  return Math.max(0, item.required - itemOwned(item));
}

function progress(item) {
  return Math.min(1, itemOwned(item) / item.required);
}

function itemMethod(item) {
  const primary = item.how || "";
  if (/รายวัน|เควส|ดวงตาแห่งโอคิลูอา|ราบีเคลล์|โอลด์มูน/.test(primary)) return "daily";
  if (/แลกเปลี่ยน|สิ่งของการค้า|\[ระดับ/.test(primary)) return "barter";
  if (/อีกาดำ|ราวีเนีย|Crow Coin/.test(primary)) return "crow";
  if (/พัลลาซี|ตลาดซื้อขาย|ซื้อจาก/.test(primary)) return "buy";
  const text = `${primary} ${item.notes}`;
  const found = methodRules.find(([, words]) => words.some((word) => text.includes(word)));
  return found ? found[0] : "other";
}

function parsedCrowPrice(item) {
  const text = `${item.how || ""} ${item.notes || ""}`;
  const patterns = [
    /ร้านค้าอีกาดำ[^()]{0,40}\(([\d,]+)\s*เหรียญ\)/,
    /อีกาดำ[^()]{0,40}\(([\d,]+)\s*เหรียญ\)/,
    /ราวีเนีย[^()]{0,80}\(([\d,]+)\s*เหรียญ\)/,
    /ราวีเนีย[^0-9]{0,40}ราคา\s*([\d,]+)\s*\/?\s*ชิ้น/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1].replace(/,/g, ""));
  }
  return 0;
}

function crowPrice(item) {
  const parsed = parsedCrowPrice(item);
  if (parsed) return parsed;
  const rule = crowCoinPriceRules.find(([name]) => item.name.includes(name));
  return rule ? rule[1] : 0;
}

function crowCost(item) {
  const price = crowPrice(item);
  return price ? price * itemMissing(item) : 0;
}

function formatCrow(price) {
  return `${price.toLocaleString("th-TH")} เหรียญ`;
}

function crowCostBadge(item) {
  const price = crowPrice(item);
  if (!price) return "";
  const total = crowCost(item);
  return `<span class="cost-badge">อีกาดำ ${formatCrow(price)}/ชิ้น${total ? ` · รวม ${formatCrow(total)}` : ""}</span>`;
}

function sourceDetail(item) {
  return `${item.how || "ตรวจในเกม/แหล่งข้อมูลอีกครั้ง"} ${crowCostBadge(item)}`;
}

function itemLookupByName(name) {
  const normalized = normalizeItemName(name);
  return raw.items.find((entry) => {
    const entryName = normalizeItemName(entry.name);
    return entryName === normalized || entryName.includes(normalized) || normalized.includes(entryName);
  });
}

function normalizeItemName(name) {
  return String(name || "")
    .replace(/\s*x\s*[\d,]+$/i, "")
    .replace(/\s*[×x]\s*[\d,]+$/i, "")
    .replace(/^[\s.,;:/\\\-–—•]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ingredientIcon(label) {
  const normalized = normalizeItemName(label);
  const fallback = Object.entries(ingredientImages)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([name]) => normalized.includes(name) || name.includes(normalized));
  if (fallback) return `<span class="ingredient-icon"><img src="${fallback[1]}" alt="" loading="lazy" referrerpolicy="no-referrer" /></span>`;
  const found = itemLookupByName(normalized);
  const image = found ? itemImage(found) : "";
  if (image) return `<span class="ingredient-icon"><img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" /></span>`;
  return `<span class="ingredient-icon text">${normalized.slice(0, 1)}</span>`;
}

function parsedProcessParts(item) {
  const parts = [];
  const text = `${item.how || ""} / ${item.notes || ""}`;
  text.split("/").forEach((rawPart) => {
    const part = rawPart.trim();
    const match = part.match(/^(.+?)\s*x\s*([\d,]+)\s*(?:\(([^)]+)\))?/i);
    if (!match) return;
    const name = normalizeItemName(match[1].replace(/[;:,]+$/g, ""));
    const qty = Number(match[2].replace(/,/g, ""));
    const method = (match[3] || "").trim();
    if (!name || !Number.isFinite(qty)) return;
    parts.push({ name, qty, method });
  });
  return parts;
}

function recipeFlow(item, compact = false) {
  const processParts = parsedProcessParts(item);
  if (processParts.length) {
    const title = processParts.find((part) => part.method)?.method || "แปรรูป";
    const missing = itemMissing(item);
    return `
      <div class="recipe-flow ${compact ? "compact" : ""}">
        <div class="recipe-flow-title">${title}</div>
        ${processParts
          .map((part) => {
            const total = part.qty * missing;
            return `
            <div class="ingredient-row">
              ${ingredientIcon(part.name)}
              <span>${part.name}${part.method && part.method !== title ? ` <em>${part.method}</em>` : ""}</span>
              <strong>x${part.qty.toLocaleString("th-TH")}</strong>
              ${missing ? `<small>รวม ${total.toLocaleString("th-TH")}</small>` : ""}
            </div>`;
          })
          .join("")}
      </div>`;
  }

  const rule = recipeRules.find((entry) => item.name.includes(entry.match));
  if (!rule) return "";
  const actionWords = ["หลอม", "ตัดฟืน", "ตากแห้ง", "แปรธาตุอย่างง่าย", "ผลิต", "ร้านค้าอีกาดำ", "แลกเปลี่ยนระดับ 3", "แลกเปลี่ยนระดับ 5", "เควสรายวัน", "รายวัน"];
  const actions = rule.chips.filter((chip) => actionWords.some((word) => chip.includes(word)));
  const ingredients = rule.chips.filter((chip) => !actions.includes(chip));
  const title = actions[0] || "แปรรูป";
  const list = ingredients.length ? ingredients : rule.chips;
  return `
    <div class="recipe-flow ${compact ? "compact" : ""}">
      <div class="recipe-flow-title">${title}</div>
      ${list
        .map(
          (chip) => `
          <div class="ingredient-row">
            ${ingredientIcon(chip)}
            <span>${chip}</span>
          </div>`
        )
        .join("")}
    </div>`;
}

function miniItemBadge(item) {
  const missing = itemMissing(item);
  const done = missing === 0;
  const label = `ใช้ ${item.required.toLocaleString("th-TH")}`;
  return `<span class="mini-count ${done ? "done" : ""}">${label}</span>`;
}

function gearTarget(item) {
  const knownTargets = [
    "หัวเรือมังกรดำ",
    "หุ้มเกราะดัดแปลง",
    "ปืนใหญ่เมย์นา",
    "ใบเรือแล่นลมชั้นเมฆ",
    "หัวเรือของชีโล่",
    "ใบเรือของชีโล่",
    "ปืนใหญ่ของชีโล่",
    "หุ้มเกราะดำของชีโล่",
  ];
  const stageMatch = item.stage.match(/(?:อุปกรณ์เรือ|อุปกรณ์คาแร็ค)[^:]*:\s*(.+)$/);
  if (stageMatch) return knownTargets.find((target) => stageMatch[1].includes(target)) || stageMatch[1].trim();
  const noteMatch = `${item.notes || ""} ${item.how || ""}`.match(/ใช้ทำ([^/;,]+)/);
  if (!noteMatch) return "";
  return knownTargets.find((target) => noteMatch[1].includes(target)) || noteMatch[1].trim();
}

function gearTargetBadge(item) {
  const target = gearTarget(item);
  return target ? `<span class="gear-target-pill">ใช้ทำ: ${target}</span>` : "";
}

function gearGroupHeader(target, entries) {
  const plusItem = entries.find((item) => item.name.startsWith("+10")) || raw.items.find((item) => item.name.startsWith("+10") && item.name.includes(target));
  const targetItem = plusItem || itemLookupByName(target);
  const image = targetItem ? itemImage(targetItem) : "";
  const needsPlusTen = Boolean(plusItem) || (targetItem?.how || "").includes("+10");
  const done = entries.filter((item) => itemMissing(item) === 0).length;
  return `
    <div class="gear-group-head">
      <div class="mini-art target">${image ? `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : "⚙"}${needsPlusTen ? `<span class="plus-ten">+10</span>` : ""}</div>
      <div>
        <strong>${target}</strong>
        <span>${needsPlusTen ? "ต้องเสริมประสิทธิภาพ +10 · " : ""}${done}/${entries.length} รายการครบแล้ว</span>
      </div>
    </div>`;
}

function processIconGrid(items, grouped) {
  if (!grouped) {
    return items
      .slice(0, 12)
      .map((item) => {
        const image = itemImage(item);
        return `<div class="mini-art ${itemMissing(item) === 0 ? "done" : ""}" title="${item.name} | ใช้ ${item.required.toLocaleString("th-TH")} | มี ${itemOwned(item).toLocaleString("th-TH")} | ขาด ${itemMissing(item).toLocaleString("th-TH")}">${
          image ? `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : item.category.replace(/\ufe0f/g, "")
        }${miniItemBadge(item)}</div>`;
      })
      .join("");
  }

  const groups = items.reduce((acc, item) => {
    const target = gearTarget(item) || "รายการอื่น";
    acc[target] = acc[target] || [];
    acc[target].push(item);
    return acc;
  }, {});
  return Object.entries(groups)
    .map(
      ([target, entries]) => {
        const baseItems = entries.filter((item) => item.name.startsWith("+10"));
        const materialItems = entries.filter((item) => !item.name.startsWith("+10"));
        const renderMini = (item) => {
          const image = itemImage(item);
          const type = item.name.startsWith("+10") ? "ซื้อเดิมมาเสริม +10" : `วัตถุดิบทำ ${target}`;
          return `<div class="mini-art ${itemMissing(item) === 0 ? "done" : ""}" title="${type} | ${item.name} | ใช้ ${item.required.toLocaleString("th-TH")} | มี ${itemOwned(item).toLocaleString("th-TH")} | ขาด ${itemMissing(item).toLocaleString("th-TH")}">${
            image ? `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : item.category.replace(/\ufe0f/g, "")
          }${miniItemBadge(item)}<span class="mini-kind">${item.name.startsWith("+10") ? "+10" : "วัสดุ"}</span></div>`;
        };
        return `
          <div class="gear-icon-group">
            ${gearGroupHeader(target, entries)}
            ${baseItems.length ? `<div class="gear-subtitle">ซื้อเดิมมาเสริม +10</div><div class="gear-materials base">${baseItems.map(renderMini).join("")}</div>` : ""}
            ${materialItems.length ? `<div class="gear-subtitle">วัตถุดิบประกอบ</div><div class="gear-materials">${materialItems.slice(0, 8).map(renderMini).join("")}</div>` : ""}
          </div>`;
      }
    )
    .join("");
}

function itemImage(item) {
  if (item.icon) return item.icon;
  const text = `${item.stage} ${item.name} ${item.how}`;
  if (text.includes("ใบลงทะเบียน")) return fallbackImages.start;
  if (text.includes("เรือการค้า")) return fallbackImages.caravel;
  if (text.includes("เรือแกลลีย์")) return fallbackImages.galleass;
  if (text.includes("ฉุกเฉิน") || text.includes("แข็งแกร่ง")) return fallbackImages.carrackCombat;
  if (text.includes("ทนทาน") || text.includes("สมดุล")) return fallbackImages.carrackTrade;
  if (text.includes("อุปกรณ์") || text.includes("+10") || text.includes("ชีโล่")) return fallbackImages.gear;
  return fallbackImages.material;
}

function missingItems(items) {
  return items.filter((item) => itemMissing(item) > 0);
}

function stageProgress(items, matchWords) {
  const scoped = items.filter((item) => matchWords.some((word) => `${item.stage} ${item.name}`.includes(word)));
  if (!scoped.length) return { done: 0, total: 0, pct: 0 };
  const done = scoped.filter((item) => itemMissing(item) === 0).length;
  return { done, total: scoped.length, pct: Math.round((done / scoped.length) * 100) };
}

function topMissingByMethod(items, method, limit = 3) {
  return missingItems(items)
    .filter((item) => itemMethod(item) === method)
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, limit);
}

function compactItemList(items) {
  if (!items.length) return "ไม่มีรายการค้างในหมวดนี้";
  return items.map((item) => `${item.name} ขาด ${itemMissing(item)}`).join(" / ");
}

function currentStepContext(items) {
  const step = activeProcessStep(items);
  const stepItems = itemsForProcessStep(items, step);
  const missing = stepItems.filter((item) => itemMissing(item) > 0).sort((a, b) => priorityScore(b) - priorityScore(a));
  const done = stepItems.filter((item) => itemMissing(item) === 0).length;
  const missingQty = stepItems.reduce((sum, item) => sum + itemMissing(item), 0);
  const progressPct = stepItems.length ? Math.round((done / stepItems.length) * 100) : 0;
  return { step, stepItems, missing, done, missingQty, progressPct };
}

function topMissingForPlan(items, method, limit = 4) {
  const { missing } = currentStepContext(items);
  const scoped = missing.filter((item) => itemMethod(item) === method);
  const fallback = topMissingByMethod(items, method, limit);
  return (scoped.length ? scoped : fallback).slice(0, limit);
}

function processDefinitions() {
  return processPlans[state.target] || processPlans.advance;
}

function itemsForProcessStep(items, step) {
  const hay = (item) => `${item.stage} ${item.name}`;
  return items.filter((item) => step.words.some((word) => hay(item).includes(word)));
}

function activeProcessStep(items) {
  const defs = processDefinitions();
  const saved = defs.find((step) => step.id === state.processStep);
  if (saved) return saved;
  return defs.find((step) => itemsForProcessStep(items, step).some((item) => itemMissing(item) > 0)) || defs[0];
}

function targetItems() {
  return raw.items.filter((item) => {
    if (state.target === "all") return true;
    if (Array.isArray(item.routes)) return item.routes.includes(state.target);
    const isAdvance = item.stage.includes(targetStage.advance) || item.category.includes("🏴");
    const isBalance = item.stage.includes(targetStage.balance) || item.category.includes("⚖");
    const isVolante = item.stage.includes(targetStage.volante) || item.category.includes("💨");
    const isValor = item.stage.includes(targetStage.valor) || item.category.includes("🛡");
    if (state.target === "advance" && isBalance) return false;
    if (state.target === "balance" && isAdvance) return false;
    if (state.target === "volante" && !isVolante) return false;
    if (state.target === "valor" && !isValor) return false;
    return true;
  });
}

function normalizeSearchText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+]+/gu, "");
}

function itemSearchText(item) {
  const method = itemMethod(item);
  return `${item.name} ${item.stage} ${item.how} ${item.notes} ${methodNames[method] || ""} ${gearTarget(item)}`;
}

function queryTokens(query) {
  return String(query || "")
    .toLowerCase()
    .split(/[\s,;/]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function matchesSearch(item, query) {
  const tokens = queryTokens(query);
  if (!tokens.length) return true;
  const rawText = itemSearchText(item).toLowerCase();
  const compactText = normalizeSearchText(rawText);
  return tokens.every((token) => {
    const variants = [token, ...(searchAliases[token] || [])].map(normalizeSearchText).filter(Boolean);
    return variants.some((variant) => compactText.includes(variant) || rawText.includes(token));
  });
}

function filteredItems(items = targetItems()) {
  return items.filter((item) => {
    const missing = itemMissing(item);
    if (state.status === "missing" && missing <= 0) return false;
    if (state.status === "done" && missing > 0) return false;
    if (state.method !== "all" && itemMethod(item) !== state.method) return false;
    return matchesSearch(item, state.query);
  });
}

function activeFilterLabels() {
  const labels = [];
  if (state.query.trim()) labels.push(`คำค้น “${state.query.trim()}”`);
  if (state.method !== "all") labels.push(methodNames[state.method] || "วิธีหาอื่น ๆ");
  if (state.status === "missing") labels.push("ของที่ยังขาด");
  if (state.status === "done") labels.push("ครบแล้ว");
  return labels;
}

function renderSearchMeta(allItems, visibleItems) {
  const root = document.querySelector("#searchMeta");
  if (!root) return;
  const labels = activeFilterLabels();
  const hidden = allItems.length - visibleItems.length;
  const hasQuery = state.query.trim().length > 0;
  document.querySelector("#clearSearch")?.classList.toggle("show", hasQuery);
  root.innerHTML = `
    <span>ตัวกรองนี้ใช้กับรายการวัตถุดิบด้านล่าง</span>
    <strong>พบ ${visibleItems.length.toLocaleString("th-TH")} / ${allItems.length.toLocaleString("th-TH")} รายการ</strong>
    ${labels.length ? `<em>${labels.join(" · ")}</em>` : `<em>ยังไม่ใช้ตัวกรอง</em>`}
    ${hidden > 0 ? `<small>ซ่อน ${hidden.toLocaleString("th-TH")} รายการ</small>` : ""}
  `;
}

function renderStats(items) {
  const total = items.length;
  const done = items.filter((item) => itemMissing(item) === 0).length;
  const missingQty = items.reduce((sum, item) => sum + itemMissing(item), 0);
  const crowTotal = items.reduce((sum, item) => sum + crowCost(item), 0);
  const bottlenecks = items
    .filter((item) => itemMissing(item) > 0 && /น้ำตา|เจิดจรัส|ลำต้น|กาวที่มี/.test(item.name))
    .length;

  document.querySelector("#stats").innerHTML = [
    ["ความคืบหน้า", `${done}/${total}`],
    ["จำนวนที่ยังขาด", missingQty.toLocaleString("th-TH")],
    ["เหรียญอีกาดำ", crowTotal ? crowTotal.toLocaleString("th-TH") : "0"],
    ["วันเล่น/สัปดาห์", state.daysPerWeek],
  ]
    .map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderMethodOptions() {
  const select = document.querySelector("#methodFilter");
  const options = Object.entries(methodNames)
    .map(([id, name]) => `<option value="${id}">${name}</option>`)
    .join("");
  select.innerHTML = `<option value="all">ทุกวิธีหา</option>${options}<option value="other">อื่น ๆ</option>`;
  select.value = state.method;
}

function renderTargetControls() {
  document.querySelectorAll(".segment").forEach((button) => {
    const target = shipTargets[button.dataset.target];
    if (!target) return;
    button.innerHTML = `
      <span class="ship-thumb" style="--ship-image: url('${target.image}'); --ship-pos: ${target.position || "center"}; --ship-size: ${target.size || "210% 210%"}"></span>
      <span><strong>${target.label}</strong><small>${target.symbol} · ${target.tag}</small></span>`;
  });
}

function renderShipAdvice(items) {
  const ship = raw.ships.find((entry) => {
    if (state.target === "advance") return entry.alias === "Advance";
    if (state.target === "balance") return entry.alias === "Balance";
    if (state.target === "volante") return entry.alias === "Volante";
    if (state.target === "valor") return entry.alias === "Valor";
    return entry.alias === "Advance";
  });
  const missing = items.filter((item) => itemMissing(item) > 0);
  const tear = missing.find((item) => item.name.includes("น้ำตาแห่งทะเลลึก"));
  const target = shipTargets[state.target] || shipTargets.advance;
  const shipName = state.target === "all" ? target.title : ship.name;
  const route = state.target === "all" ? "เลือกสายเพื่อดู process เฉพาะทาง" : `ต่อจาก ${ship.from}`;
  document.querySelector("#shipAdvice").innerHTML = `
    <div class="ship-hero" style="--ship-image: url('${target.image}'); --ship-pos: ${target.heroPosition || target.position || "center"}; --ship-size: ${target.size || "210% 210%"}">
      <div class="ship-hero-overlay">
        <span>${target.tag}</span>
        <strong>${shipName}</strong>
        <em>${target.symbol}</em>
      </div>
    </div>
    <div class="ship-facts">
      <div><span>เส้นทาง</span><strong>${route}</strong></div>
      <div><span>จุดเด่น</span><strong>${state.target === "all" ? target.focus : ship.strength}</strong></div>
    </div>
    <p>${target.focus}</p>
    <p>${tear ? `คอขวด: น้ำตาแห่งทะเลลึกยังขาด ${itemMissing(tear)} ชิ้น จัดเป็นงานประจำวันก่อน` : "คอขวดน้ำตาแห่งทะเลลึกครบแล้ว"}</p>
  `;
}

function recommendationText(items) {
  const missing = items.filter((item) => itemMissing(item) > 0);
  const methodCount = missing.reduce((acc, item) => {
    const method = itemMethod(item);
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});
  const topMethod = Object.entries(methodCount).sort((a, b) => b[1] - a[1])[0];
  const bottleneck = missing.find((item) => /น้ำตา|เจิดจรัส|ลำต้น|กาวที่มี/.test(item.name));
  const quickWins = missing.filter((item) => item.required <= 4 || itemMissing(item) <= 4).length;

  return [
    {
      title: "งานแรกที่ควรทำ",
      body: bottleneck
        ? `${bottleneck.name} ยังขาด ${itemMissing(bottleneck)} ชิ้น ให้ล็อกเป็นงานรายวัน/แลกเปลี่ยนก่อน เพราะมักรอรอบนาน`
        : "รายการคอขวดหลักครบแล้ว ให้ปิดงานอุปกรณ์ +10 และวัสดุจำนวนมากต่อ",
    },
    {
      title: "วิธีหาที่หนักสุด",
      body: topMethod ? `${methodNames[topMethod[0]] || "อื่น ๆ"} มี ${topMethod[1]} รายการที่ยังค้างอยู่` : "ไม่มีรายการค้าง",
    },
    {
      title: "งานปิดเร็ว",
      body: quickWins ? `มี ${quickWins} รายการที่ขาดไม่มาก เหมาะกับการปิด checklist ให้โล่งก่อน` : "ไม่มีงานปิดเร็วแล้ว ตอนนี้เหลือแต่งานสะสม",
    },
  ];
}

function renderRecommendations(items) {
  document.querySelector("#recommendations").innerHTML = recommendationText(items)
    .map((rec) => `<div class="rec-card"><strong>${rec.title}</strong><p>${rec.body}</p></div>`)
    .join("");
}

function renderFocusItems(items) {
  const root = document.querySelector("#focusItems");
  if (!root) return;
  const step = activeProcessStep(items);
  const processItems = itemsForProcessStep(items, step).filter((item) => itemMissing(item) > 0);
  const list = (processItems.length ? processItems : missingItems(items))
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .slice(0, 3);
  root.innerHTML =
    list
      .map((item) => {
        const image = itemImage(item);
        return `
          <div class="focus-card">
            <div class="item-art">${image ? `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : item.category.replace(/\ufe0f/g, "")}</div>
            <div><strong>${item.name}</strong><span>${methodNames[itemMethod(item)] || "อื่น ๆ"} · ขาด ${itemMissing(item)}</span></div>
          </div>`;
      })
      .join("") || `<div class="empty">ครบทุกอย่างในขั้นนี้แล้ว</div>`;
}

function buildTodayPlan(items) {
  const time = Number(state.timeBudget) || 120;
  const daily = topMissingForPlan(items, "daily", 4);
  const barter = topMissingForPlan(items, "barter", 4);
  const craft = topMissingForPlan(items, "craft", 4);
  const hunt = topMissingForPlan(items, "hunt", 4);
  const buy = topMissingForPlan(items, "buy", 3);
  const crow = topMissingForPlan(items, "crow", 3);
  const { missing } = currentStepContext(items);
  const stepNow = missing.slice(0, 4);
  const blocks =
    time <= 60
      ? [
          { min: 15, title: "ปิดของในขั้นตอนนี้ก่อน", items: stepNow, note: "เริ่มจากของที่ทำให้ step ปัจจุบันเดินต่อได้ทันที" },
          { min: 20, title: "ทำเควสรายวัน/โอคิลูอา", items: daily, note: "ของจำกัดรอบควรล็อกก่อน เช่น น้ำตา ลำต้น และกาวทะเลลึก" },
          { min: 15, title: "เช็กแลกเปลี่ยนทะเล", items: barter, note: "ดูรายการ T2-T5 ที่แลกเป็นวัสดุของ step นี้หรือคอขวดใหญ่" },
          { min: 10, title: "ซื้อ/ผลิตปิดงานเร็ว", items: buy.concat(crow, craft).slice(0, 4), note: "ใช้พัลลาซี ตลาด ราวีเนีย หรือคนงานปิดรายการที่เหลือน้อย" },
        ]
      : [
          { min: 20, title: "ปิดของในขั้นตอนนี้", items: stepNow, note: "ทำรายการที่ขาดใน Process ก่อน เพราะเป็นตัวปลดขั้นต่อไป" },
          { min: 30, title: "ทำเควสรายวันก่อน", items: daily, note: "ของรายวันคือคอขวด ถ้าพลาดหนึ่งวันมักยืดแผนทั้งลำ" },
          { min: 30, title: "เดินแลกเปลี่ยนทะเล", items: barter, note: "โฟกัสไอเทมระดับ 2-5 ที่ตรงกับ step ปัจจุบันก่อน" },
          { min: 20, title: "ผลิต/ซื้อ/แลกแก้ของขาด", items: buy.concat(crow, craft).slice(0, 4), note: "ซื้อจากพัลลาซี ตลาด ราวีเนีย หรือสั่งผลิตของที่ต้องใช้" },
          { min: 20, title: "ล่าทะเลเมื่อจำเป็น", items: hunt, note: "ทำเฉพาะเมื่อใน step นี้มีของมอนทะเลจริง ๆ ไม่ต้องเสียเวลาออกทะเลถ้าไม่มี" },
        ];
  return blocks.filter((block) => block.items.length);
}

function renderTodayPlan(items) {
  const blocks = buildTodayPlan(items);
  const { step, missing, progressPct } = currentStepContext(items);
  const stepCrowCost = missing.reduce((sum, item) => sum + crowCost(item), 0);
  const crowLine = stepCrowCost ? ` · เหรียญอีกาดำที่ต้องเผื่อ ${formatCrow(stepCrowCost)}` : "";
  document.querySelector("#planSummary").textContent = `${state.timeBudget} นาที / ขั้นนี้ ${progressPct}%`;
  document.querySelector("#aiBrief").innerHTML = `
    <strong>${step.title.replace(/^[0-9]+\\.\\s*/, "")}</strong>
    <span>${missing.length ? `AI แนะนำให้ปิด ${missing[0].name} ก่อน เพราะยังขาด ${itemMissing(missing[0]).toLocaleString("th-TH")}${crowLine}` : "ขั้นนี้ครบแล้ว เลือกขั้นถัดไปหรือเช็ก Route ต่อ"}</span>
  `;
  document.querySelector("#todayPlan").innerHTML = blocks
    .map(
      (block) => `
      <div class="plan-task">
        <div class="task-time"><strong>${block.min}</strong><span>นาที</span></div>
        <div class="task-body">
          <strong>${block.title}</strong>
          <p>${block.note}</p>
          <div class="raw-recipe">${block.items
            .map((item) => `<span class="recipe-chip">${item.name}: ขาด ${itemMissing(item)}${crowPrice(item) ? ` · อีกาดำ ${formatCrow(crowPrice(item))}` : ""}</span>`)
            .join("")}</div>
        </div>
      </div>`
    )
    .join("");
}

function renderRouteSteps(items) {
  const plan = routePlans[state.target] || routePlans.advance;
  document.querySelector("#routeSteps").innerHTML = plan
    .map((step, idx) => {
      const prog = stageProgress(items, step.match);
      const done = prog.total > 0 && prog.done === prog.total;
      return `
        <div class="route-step ${done ? "done" : ""}">
          <div class="route-dot">${idx + 1}</div>
          <div><strong>${step.title}</strong><span>${prog.total ? `${prog.done}/${prog.total} รายการ` : "ใช้เป็นขั้นนำทาง"}</span></div>
          <span>${prog.pct}%</span>
        </div>`;
    })
    .join("");
}

function renderMethodBuckets(items) {
  const buckets = ["daily", "barter", "craft", "hunt", "crow", "buy"];
  const { missing: stepMissing } = currentStepContext(items);
  document.querySelector("#methodBuckets").innerHTML = buckets
    .map((method) => {
      const scoped = stepMissing.filter((item) => itemMethod(item) === method);
      const list = (scoped.length ? scoped : topMissingByMethod(items, method, 4)).slice(0, 4);
      const total = scoped.length;
      return `
        <div class="bucket">
          <h3>${methodNames[method]}</h3>
          <p>${total ? `${total} รายการในขั้นนี้` : "ไม่มีในขั้นนี้"}</p>
          <div class="bucket-list">
            ${list
              .map((item) => {
                const price = crowPrice(item);
                const cost = crowCost(item);
                const extra = price ? `<small>อีกาดำ ${formatCrow(price)}/ชิ้น${cost ? ` · รวม ${formatCrow(cost)}` : ""}</small>` : "";
                return `<div class="bucket-item"><strong>${item.name}${extra}</strong><span>${itemMissing(item)}</span></div>`;
              })
              .join("") || `<div class="bucket-item"><strong>ไม่มีรายการค้าง</strong><span>0</span></div>`}
          </div>
        </div>`;
    })
    .join("");
}

function renderProcessOptions(items) {
  const select = document.querySelector("#processStep");
  if (!select) return;
  const defs = processDefinitions();
  const active = activeProcessStep(items);
  select.innerHTML = defs.map((step) => `<option value="${step.id}">${step.title}</option>`).join("");
  select.value = active.id;
}

function renderProcessView(items) {
  const root = document.querySelector("#processView");
  if (!root) return;
  const step = activeProcessStep(items);
  const scoped = itemsForProcessStep(items, step);
  const missing = scoped.filter((item) => itemMissing(item) > 0);
  const missingQty = scoped.reduce((sum, item) => sum + itemMissing(item), 0);
  const byMethod = missing.reduce((acc, item) => {
    const method = itemMethod(item);
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});
  const mainMethod = Object.entries(byMethod).sort((a, b) => b[1] - a[1])[0]?.[0] || "other";
  const sorted = [...scoped].sort((a, b) => priorityScore(b) - priorityScore(a));
  const completeItems = scoped.filter((item) => itemMissing(item) === 0).length;
  const stepProgress = scoped.length ? Math.round((completeItems / scoped.length) * 100) : 0;
  const stepCrowCost = scoped.reduce((sum, item) => sum + crowCost(item), 0);
  const groupedGear = sorted.some((item) => gearTarget(item));

  root.innerHTML = `
    <div class="process-summary">
      <div class="process-kpi"><span>ขั้นตอน</span><strong>${step.title.replace(/^[0-9]+\\.\\s*/, "")}</strong></div>
      <div class="process-kpi"><span>รายการในขั้นนี้</span><strong>${scoped.length}</strong></div>
      <div class="process-kpi"><span>ยังขาดรวม</span><strong>${missingQty.toLocaleString("th-TH")}</strong></div>
      <div class="process-kpi"><span>วิธีหาหลัก</span><strong>${methodNames[mainMethod] || "หลายวิธี"}</strong></div>
      <div class="process-kpi"><span>เหรียญอีกาดำ</span><strong>${stepCrowCost ? stepCrowCost.toLocaleString("th-TH") : "0"}</strong></div>
    </div>
    <div class="rec-card"><strong>เข้าใจขั้นนี้</strong><p>${step.note}</p></div>
    <div class="process-map">
      <aside class="process-visual ${groupedGear ? "gear-mode" : ""}">
        <p class="eyebrow">Step View</p>
        <h3>${step.title}</h3>
        <div class="process-progress"><span style="width: ${stepProgress}%"></span></div>
        <strong>${completeItems}/${scoped.length} รายการครบแล้ว</strong>
        <div class="process-icon-grid ${groupedGear ? "grouped" : ""}">
          ${processIconGrid(sorted, groupedGear)}
        </div>
      </aside>
      <div class="process-table-wrap">
        <table class="process-table">
          <thead>
            <tr>
              <th>ไอเทม</th>
              <th>ต้องใช้</th>
              <th>มีแล้ว</th>
              <th>ขาด</th>
              <th>ได้จาก</th>
              <th>อัปเดต</th>
            </tr>
          </thead>
          <tbody>
            ${sorted
              .map((item) => {
                const image = itemImage(item);
                const missing = itemMissing(item);
                return `
                  <tr class="${missing === 0 ? "done" : ""}">
                    <td>
                      <div class="table-item">
                        <div class="mini-art">${image ? `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : item.category.replace(/\ufe0f/g, "")}</div>
                        <strong>${item.name}</strong>
                      </div>
                    </td>
                    <td>${item.required.toLocaleString("th-TH")}</td>
                    <td>${itemOwned(item).toLocaleString("th-TH")}</td>
                    <td><strong>${missing.toLocaleString("th-TH")}</strong></td>
                    <td>
                      <div class="source-box">
                        ${gearTargetBadge(item)}
                        <span class="method-pill">${methodNames[itemMethod(item)] || "อื่น ๆ"}</span>
                        <p>${sourceDetail(item)}</p>
                        ${recipeFlow(item, true)}
                      </div>
                    </td>
                    <td>
                      <div class="table-actions">
                        <label class="process-owned-field">
                          <span>มีแล้ว</span>
                          <input type="number" min="0" max="${item.required}" value="${itemOwned(item)}" data-process-owned="${item.id}" />
                        </label>
                        <button type="button" data-process-plus="${item.id}">+1</button>
                        <button type="button" data-process-done="${item.id}">ครบ</button>
                      </div>
                    </td>
                  </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    <div class="process-items">
      ${sorted
        .map((item) => {
          const image = itemImage(item);
          const method = itemMethod(item);
          return `
            <article class="process-item">
              <div class="item-art">${image ? `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : item.category.replace(/\ufe0f/g, "")}</div>
              <div>
                <h3>${item.name}</h3>
                <div class="process-meta">
                  <span class="method-pill">${methodNames[method] || "อื่น ๆ"}</span>
                  ${gearTargetBadge(item)}
                  <span class="recipe-chip">ต้องใช้ ${item.required}</span>
                  <span class="recipe-chip">มี ${itemOwned(item)}</span>
                  <span class="recipe-chip">ขาด ${itemMissing(item)}</span>
                </div>
                <p>${sourceDetail(item)}</p>
                ${item.notes ? `<p>${item.notes}</p>` : ""}
                ${recipeFlow(item)}
                <div class="process-actions" aria-label="ปรับจำนวนที่มี">
                  <button type="button" data-process-minus="${item.id}">-1</button>
                  <button type="button" data-process-plus="${item.id}">+1</button>
                  <button type="button" data-process-done="${item.id}">ครบ</button>
                </div>
              </div>
            </article>`;
        })
        .join("")}
    </div>`;

  root.querySelectorAll("[data-process-minus]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = scoped.find((entry) => entry.id === button.dataset.processMinus);
      if (!item) return;
      state.owned[item.id] = clamp(itemOwned(item) - 1, 0, item.required);
      saveState();
      render();
    });
  });
  root.querySelectorAll("[data-process-plus]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = scoped.find((entry) => entry.id === button.dataset.processPlus);
      if (!item) return;
      state.owned[item.id] = clamp(itemOwned(item) + 1, 0, item.required);
      saveState();
      render();
    });
  });
  root.querySelectorAll("[data-process-owned]").forEach((input) => {
    input.addEventListener("change", () => {
      const item = scoped.find((entry) => entry.id === input.dataset.processOwned);
      if (!item) return;
      state.owned[item.id] = clamp(Number(input.value || 0), 0, item.required);
      saveState();
      render();
    });
  });
  root.querySelectorAll("[data-process-done]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = scoped.find((entry) => entry.id === button.dataset.processDone);
      if (!item) return;
      state.owned[item.id] = item.required;
      saveState();
      render();
    });
  });
}

function renderForumOptions() {
  const select = document.querySelector("#forumFilter");
  if (!select) return;
  const groups = [...new Set((raw.forumAssets || []).map((asset) => asset.group))];
  select.innerHTML = `<option value="all">ทุกรูปจากบอร์ด</option>${groups
    .map((group) => `<option value="${group}">${forumGroupNames[group] || group}</option>`)
    .join("")}`;
  select.value = state.forumGroup;
}

function renderForumGallery() {
  if (!document.querySelector("#forumGallery")) return;
  const assets = (raw.forumAssets || []).filter((asset) => {
    if (state.forumGroup === "all") return true;
    return asset.group === state.forumGroup;
  });
  document.querySelector("#forumGallery").innerHTML = assets
    .map(
      (asset) => `
      <a class="forum-card" href="${asset.url}" target="_blank" rel="noreferrer">
        <div class="forum-image">
          <img src="${asset.url}" alt="${asset.title}" loading="lazy" referrerpolicy="no-referrer" />
        </div>
        <div class="forum-caption">
          <strong>${asset.title}</strong>
          <span>${forumGroupNames[asset.group] || asset.group}</span>
        </div>
      </a>`
    )
    .join("");
}

function recipeChips(item) {
  const rule = recipeRules.find((entry) => item.name.includes(entry.match));
  if (!rule) return "";
  return rule.chips.map((chip) => `<span class="recipe-chip">${chip}</span>`).join("");
}

function renderItems(items) {
  const list = document.querySelector("#itemList");
  const template = document.querySelector("#itemTemplate");
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `
      <div class="empty search-empty">
        <strong>ไม่พบรายการตามตัวกรองนี้</strong>
        <span>ลองลดเงื่อนไข เช่น เปลี่ยนสถานะเป็น “ทั้งหมด” หรือล้างคำค้น</span>
      </div>`;
    return;
  }

  for (const item of items) {
    const node = template.content.firstElementChild.cloneNode(true);
    const owned = itemOwned(item);
    const missing = itemMissing(item);
    const pct = Math.round(progress(item) * 100);
    node.classList.toggle("done", missing === 0);
    node.querySelector(".stage").textContent = `${item.category} ${item.stage}`;
    node.querySelector("h2").textContent = item.name;
    node.querySelector(".status-pill").textContent = missing ? `ขาด ${missing}` : "ครบแล้ว";
    node.querySelector(".status-pill").classList.toggle("done", missing === 0);
    node.querySelector(".bar span").style.width = `${pct}%`;
    node.querySelector(".progress-line strong").textContent = `${owned}/${item.required}`;
    node.querySelector(".how").innerHTML = sourceDetail(item);
    node.querySelector(".note").textContent = item.notes || "ไม่มีหมายเหตุเพิ่มเติม";
    node.querySelector(".raw-recipe").innerHTML = recipeFlow(item) || recipeChips(item);

    const art = node.querySelector(".item-art");
    const image = itemImage(item);
    if (image) {
      art.innerHTML = `<img src="${image}" alt="" loading="lazy" referrerpolicy="no-referrer" />`;
      art.querySelector("img").addEventListener("error", () => {
        art.textContent = item.category.replace(/\ufe0f/g, "");
      });
    } else {
      art.textContent = item.category.replace(/\ufe0f/g, "");
    }

    const input = node.querySelector(".owned-input");
    input.value = owned;
    input.max = item.required;
    input.addEventListener("change", () => {
      state.owned[item.id] = clamp(Number(input.value || 0), 0, item.required);
      saveState();
      render();
    });
    node.querySelector(".minus").addEventListener("click", () => {
      state.owned[item.id] = clamp(owned - 1, 0, item.required);
      saveState();
      render();
    });
    node.querySelector(".plus").addEventListener("click", () => {
      state.owned[item.id] = clamp(owned + 1, 0, item.required);
      saveState();
      render();
    });
    node.querySelector(".done-btn").addEventListener("click", () => {
      state.owned[item.id] = item.required;
      saveState();
      render();
    });
    list.appendChild(node);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function renderPlan(items) {
  const missing = items
    .filter((item) => itemMissing(item) > 0)
    .sort((a, b) => priorityScore(b) - priorityScore(a));
  const chunks = [];
  const tasksPerDay = clamp(Number(state.tasksPerDay), 1, 12);
  for (let i = 0; i < Math.min(missing.length, tasksPerDay * 7); i += tasksPerDay) {
    chunks.push(missing.slice(i, i + tasksPerDay));
  }
  document.querySelector("#dailyPlan").innerHTML = chunks
    .slice(0, 7)
    .map(
      (day, idx) => `
      <div class="plan-day">
        <strong>วันที่ ${idx + 1}</strong>
        <p>${day.map((item) => `${item.name} (${itemMissing(item)})`).join(" · ")}</p>
      </div>`
    )
    .join("");
}

function priorityScore(item) {
  let score = itemMissing(item);
  if (/น้ำตา|ลำต้น|กาวที่มี|เจิดจรัส/.test(item.name)) score += 1000;
  if (itemMethod(item) === "daily") score += 500;
  if (itemMethod(item) === "barter") score += 250;
  if (item.required <= 4) score += 75;
  return score;
}

function renderSources() {
  document.querySelector("#sources").innerHTML = raw.sources
    .filter((source) => source.url.startsWith("http"))
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.name}</a>`)
    .join("");
}

function render() {
  const items = targetItems();
  const visibleItems = filteredItems(items);
  renderStats(items);
  renderShipAdvice(items);
  renderFocusItems(items);
  renderRecommendations(items);
  renderTodayPlan(items);
  renderRouteSteps(items);
  renderMethodBuckets(items);
  renderProcessOptions(items);
  renderProcessView(items);
  renderPlan(items);
  renderSearchMeta(items, visibleItems);
  renderItems(visibleItems);
}

function bindEvents() {
  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segment").forEach((entry) => entry.classList.remove("active"));
      button.classList.add("active");
      state.target = button.dataset.target;
      state.processStep = "";
      saveState();
      render();
    });
  });
  document.querySelectorAll(".segment").forEach((entry) => entry.classList.remove("active"));
  document.querySelector(`[data-target="${state.target}"]`)?.classList.add("active");

  document.querySelector("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    saveState();
    render();
  });
  document.querySelector("#clearSearch")?.addEventListener("click", () => {
    state.query = "";
    document.querySelector("#searchInput").value = "";
    saveState();
    render();
  });
  document.querySelector("#methodFilter").addEventListener("change", (event) => {
    state.method = event.target.value;
    saveState();
    render();
  });
  document.querySelector("#statusFilter").addEventListener("change", (event) => {
    state.status = event.target.value;
    saveState();
    render();
  });
  document.querySelector("#forumFilter")?.addEventListener("change", (event) => {
    state.forumGroup = event.target.value;
    saveState();
    renderForumGallery();
  });
  document.querySelector("#timeBudget").addEventListener("change", (event) => {
    state.timeBudget = Number(event.target.value);
    saveState();
    render();
  });
  document.querySelector("#processStep")?.addEventListener("change", (event) => {
    state.processStep = event.target.value;
    saveState();
    render();
  });
  document.querySelector("#daysPerWeek").addEventListener("change", (event) => {
    state.daysPerWeek = clamp(Number(event.target.value), 1, 7);
    saveState();
    render();
  });
  document.querySelector("#tasksPerDay").addEventListener("change", (event) => {
    state.tasksPerDay = clamp(Number(event.target.value), 1, 12);
    saveState();
    render();
  });
  document.querySelector("#resetBtn").addEventListener("click", () => {
    if (!confirm("รีเซ็ตจำนวนที่บันทึกไว้ทั้งหมด?")) return;
    state.owned = {};
    saveState();
    render();
  });
  document.querySelector("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bdo-carrack-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  });
  document.querySelector("#importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const imported = JSON.parse(await file.text());
    Object.assign(state, imported);
    saveState();
    render();
    event.target.value = "";
  });
}

function init() {
  loadState();
  document.querySelector("#timeBudget").value = state.timeBudget;
  document.querySelector("#daysPerWeek").value = state.daysPerWeek;
  document.querySelector("#tasksPerDay").value = state.tasksPerDay;
  document.querySelector("#searchInput").value = state.query;
  document.querySelector("#statusFilter").value = state.status;
  renderTargetControls();
  renderMethodOptions();
  renderForumOptions();
  renderSources();
  bindEvents();
  render();
  renderForumGallery();
}

init();
