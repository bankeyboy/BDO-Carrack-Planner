import json
import math
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = Path(r"C:\Users\Admin\Downloads\BDO_Carrack_Ship_Upgrade_Checklist_TH_Official_Terms.xlsx")
OFFICIAL_WIKI = "https://blackdesert.pearlabyss.com/ASIA/en-us/Game/Wiki?_masterWikiNo=172"
OFFICIAL_WIKI_TH = "https://blackdesert.pearlabyss.com/asia/th-TH/Game/Wiki?_masterWikiNo=172"
FORUM_GUIDE_TH = "https://blackdesert.pearlabyss.com/asia/th-TH/Forum/ForumTopic/Detail?_topicNo=20760"


class CellParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cells = []
        self.current = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("td", "th"):
            self.current = {"text": "", "images": []}
        if tag == "img" and self.current is not None:
            src = attrs.get("src")
            if src and src.startswith("http"):
                self.current["images"].append(src)

    def handle_data(self, data):
        if self.current is not None:
            self.current["text"] += data.strip() + " "

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.current is not None:
            text = " ".join(self.current["text"].split())
            if text or self.current["images"]:
                self.cells.append((text, self.current["images"]))
            self.current = None


def forum_images():
    req = urllib.request.Request(FORUM_GUIDE_TH, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
    matches = list(re.finditer(r'<img[^>]+src="([^"]+)"[^>]*>', html))
    titles = [
        ("ภาพรวมการสร้างเรือ", "overview"),
        ("Infographic เรือแต่ละระดับ", "ship-type"),
        ("เรือสำเภาบาทัลลี่", "ship-type"),
        ("เรือสำเภาเอเฟเรีย / เรือฟริเกตเอเฟเรีย", "ship-type"),
        ("เหรียญตราตอบแทนทองคำ [จัดส่งสินค้าราชวัง]", "currency"),
        ("หน้าต่างต่อเติมเรือ", "upgrade-ui"),
        ("วัตถุดิบบาทัลลี่ → เรือสำเภาเอเฟเรีย", "materials"),
        ("วัตถุดิบบาทัลลี่ → เรือฟริเกตเอเฟเรีย", "materials"),
        ("เรือการค้าเอเฟเรีย / เรือแกลลีย์เอเฟเรีย", "ship-type"),
        ("วัตถุดิบเรือสำเภาเอเฟเรีย → เรือการค้าเอเฟเรีย", "materials"),
        ("วัตถุดิบเรือฟริเกตเอเฟเรีย → เรือแกลลีย์เอเฟเรีย", "materials"),
        ("รายการของเทรดทะเลระดับ 2", "barter"),
        ("อัตราตีบวกอุปกรณ์เรือเอเฟเรียเก่า", "enhance"),
        ("ตำแหน่งเกาะอีกาดำ", "location"),
        ("อุปกรณ์เกรดเขียวเรือการค้า/แกลลีย์", "gear"),
        ("อัตราตีบวกอุปกรณ์เกรดเขียว", "enhance"),
        ("วัตถุดิบอุปกรณ์เกรดฟ้า สายเรือการค้า", "gear"),
        ("วัตถุดิบอุปกรณ์เกรดฟ้า สายเรือแกลลีย์", "gear"),
        ("อัตราตีบวกอุปกรณ์เกรดฟ้า", "enhance"),
        ("เรือคาร์แร็คทนทาน / สมดุล", "ship-type"),
        ("วัตถุดิบคาแร็คทนทาน / สมดุล", "materials"),
        ("เรือคาร์แร็คฉุกเฉิน / แข็งแกร่ง", "ship-type"),
        ("วัตถุดิบคาแร็คฉุกเฉิน / แข็งแกร่ง", "materials"),
        ("อุปกรณ์เรือคาร์แร็คจากราวีเนีย", "gear"),
        ("อัตราตีบวกอุปกรณ์เรือคาร์แร็ค", "enhance"),
        ("ข้อมูลหินบวกเรือ", "enhance"),
        ("รายการของเทรดทะเลระดับ 2-5", "barter"),
        ("วัตถุดิบเกรดฟ้า/คาแร็คที่แลกจากเทรดได้", "barter"),
        ("วัตถุดิบเกรดฟ้า/คาแร็คที่แลกจากเทรดได้ รูปใหญ่", "barter"),
        ("NPC ราวีเนีย / ร้านค้าอีกาดำ", "location"),
        ("ตำแหน่งโหนดวัตถุดิบเรือ", "location"),
        ("กล่องสนับสนุนการแลกเปลี่ยน", "barter"),
        ("เส้นทางหายางไม้ / วัตถุดิบพื้นฐาน", "location"),
        ("เรือคาร์แร็คโอลด์มูน", "ship-type"),
        ("เตรียมตัวเด็กและเรือบาทัลลี่", "tip"),
        ("ตำแหน่งเรือคาร์แร็คโอลด์มูน", "location"),
        ("พื้นที่เทรดกับเรือโอลด์มูน", "location"),
        ("จระเข้ทะเล / มอนสเตอร์ทะเลรุนแรง", "hunt"),
        ("คาแร็คสายการค้า", "ship-type"),
        ("คาแร็คสายรบ ฉุกเฉิน", "ship-type"),
        ("คาแร็คสายรบ แข็งแกร่ง", "ship-type"),
        ("เรือพันโอก", "ship-type"),
        ("อุปกรณ์เกรดเขียวเรือพันโอก", "gear"),
        ("ตีบวกอุปกรณ์เกรดเขียวเรือพันโอก", "enhance"),
        ("อุปกรณ์เกรดฟ้าเรือพันโอก", "gear"),
        ("วัตถุดิบอุปกรณ์เกรดฟ้าเรือพันโอก", "gear"),
        ("แผนผังอุปกรณ์เกรดฟ้าเรือพันโอก", "materials"),
        ("อัตราตีบวกอุปกรณ์เกรดฟ้าเรือพันโอก", "enhance"),
        ("สเตตัสเรือพันโอกพร้อมอุปกรณ์", "ship-type"),
    ]
    assets = []
    for idx, match in enumerate(matches):
        src = match.group(1)
        if "Upload/Community" not in src:
            continue
        context = re.sub("<[^>]+>", " ", html[max(0, match.start() - 350) : match.end() + 350])
        context = " ".join(context.split())
        title, group = titles[len(assets)] if len(assets) < len(titles) else (f"รูปอ้างอิงจากบอร์ด #{len(assets) + 1}", "reference")
        assets.append(
            {
                "id": f"forum-{len(assets) + 1:02d}",
                "title": title,
                "group": group,
                "url": src,
                "sourceUrl": FORUM_GUIDE_TH,
                "context": context[:280],
            }
        )
    return assets


def clean(value):
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return str(value).strip()


def parse_material(text):
    text = clean(text)
    match = re.search(r"\s+x\s*([0-9,]+)\s*$", text)
    if not match:
        return text, 1
    qty = int(match.group(1).replace(",", ""))
    name = text[: match.start()].strip()
    return name, qty


def merge_item(items, item):
    for existing in items:
        if existing["name"] == item["name"] and existing.get("stage") == item.get("stage"):
            existing["how"] = " / ".join(dict.fromkeys(filter(None, [existing["how"], item["how"]])))
            existing["notes"] = " / ".join(dict.fromkeys(filter(None, [existing["notes"], item["notes"]])))
            if not existing.get("icon") and item.get("icon"):
                existing["icon"] = item["icon"]
            return
    items.append(item)


def rows_to_items(table, stage, category, routes, start_id, icons=None):
    grouped = {}
    for _, row in table.iloc[2:].iterrows():
        name, qty = parse_material(row.iloc[0])
        if not name or name == "nan":
            continue
        key = (name, qty)
        how = clean(row.iloc[1])
        note = clean(row.iloc[2])
        if " - " in name:
            name, inline_note = name.split(" - ", 1)
            key = (name, qty)
            note = " / ".join(filter(None, [inline_note, note]))
        if key not in grouped:
            grouped[key] = {"how": [], "notes": []}
        if how and how != "-":
            grouped[key]["how"].append(how)
        if note and note != "-":
            grouped[key]["notes"].append(note)

    output = []
    for offset, ((name, qty), detail) in enumerate(grouped.items()):
        lookup_name = re.sub(r"^\+10\s+", "", name)
        output.append(
            {
                "id": f"{start_id}-{offset + 1:02d}",
                "stage": stage,
                "category": category,
                "name": name,
                "required": qty,
                "owned": 0,
                "how": " / ".join(dict.fromkeys(detail["how"])),
                "notes": " / ".join(dict.fromkeys(detail["notes"])),
                "infoUrl": OFFICIAL_WIKI_TH,
                "sourceUrl": OFFICIAL_WIKI_TH,
                "icon": next(((icons or {}).get(key) for key in icon_keys(name) + icon_keys(lookup_name) if (icons or {}).get(key)), ""),
                "routes": routes,
            }
        )
    return output


def icon_keys(text):
    text = clean(text)
    if not text:
        return []
    keys = {text}
    no_qty = re.sub(r"\s+x\s*[0-9,]+\s*$", "", text).strip()
    keys.add(no_qty)
    keys.add(re.sub(r"^\+10\s+", "", no_qty).strip())
    keys.add(no_qty.replace(" :", ":").replace(": ", ":"))
    return [key for key in keys if key]


def official_icon_lookup(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=25).read().decode("utf-8", "ignore")
    parser = CellParser()
    parser.feed(html)
    icons = {}
    for idx, (text, images) in enumerate(parser.cells):
        if images and text:
            for key in icon_keys(text):
                icons.setdefault(key, images[0])
        if images and idx + 1 < len(parser.cells):
            next_text = parser.cells[idx + 1][0]
            if next_text:
                for key in icon_keys(next_text):
                    icons.setdefault(key, images[0])
    return icons


def main():
    icons = {}
    icons.update(official_icon_lookup(OFFICIAL_WIKI))
    icons.update(official_icon_lookup(OFFICIAL_WIKI_TH))
    icon_by_thai = {
        "เรือเอเฟเรีย : หัวเรือเก่า": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049705.webp",
        "เรือเอเฟเรีย : หุ้มเกราะเก่า": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049706.webp",
        "เรือเอเฟเรีย : ปืนใหญ่เก่า": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049707.webp",
        "เรือเอเฟเรีย : ใบเรือแล่นลมเก่า": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049708.webp",
        "ไม้แปรรูป": icons.get("Standardized Timber Square x250"),
        "เหล็ก": icons.get("Steel x200"),
        "ไม้อัดสน": icons.get("Pine Plywood x500"),
        "ผ้าลินิน": icons.get("Flax Fabric x100"),
        "เสาไม้แข็งแรง": icons.get("Hard Pillar x30"),
        "หินแปรสภาพเกราะป้องกัน ระดับสูง": icons.get("Ultimate Armor Reform Stone x10"),
        "ใบอนุญาตการสร้างเรือ : เรือการค้าเอเฟเรีย": icons.get("Ship Upgrade Permit: Epheria Caravel"),
        "แท่งโลหะควันมืดต่อเติม": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00045508.webp",
        "ไม้สำหรับต่อเติม": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00045509.webp",
        "กาวสำหรับต่อเติม": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00045510.webp",
        "ไม้อัดต้นเกาะ": icons.get("Island Tree Coated Plywood x100"),
        "แท่งเหล็กหินเกลือ": icons.get("Rock Salt Ingot x100"),
        "กาวที่มีความทรงจำของทะเลลึก": icons.get("Deep Sea Memory Filled Glue x4"),
        "ลำต้นพืชทะเลลึก": icons.get("Seaweed Stalk x4"),
        "เรือการค้าเอเฟเรีย : หัวเรือทองเหลือง": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049653.webp",
        "เรือการค้าเอเฟเรีย : หุ้มเกราะแข็งแกร่ง": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049654.webp",
        "เรือการค้าเอเฟเรีย : ปืนใหญ่เวริสชาร์": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049651.webp",
        "เรือการค้าเอเฟเรีย : ใบเรือไวท์วินด์": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049652.webp",
        "เรือการค้าเอเฟเรีย : หัวเรือมังกรดำ": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049655.webp",
        "เรือการค้าเอเฟเรีย : หุ้มเกราะดัดแปลง": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049656.webp",
        "เรือการค้าเอเฟเรีย : ปืนใหญ่เมย์นา": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049657.webp",
        "เรือการค้าเอเฟเรีย : ใบเรือแล่นลมชั้นเมฆ": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049658.webp",
        "เรือแกลลีย์เอเฟเรีย : หัวเรือสีขาว": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049665.webp",
        "เรือแกลลีย์เอเฟเรีย : หุ้มเกราะแข็งแกร่ง": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049666.webp",
        "เรือแกลลีย์เอเฟเรีย : ปืนใหญ่เวริสชาร์": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049663.webp",
        "เรือแกลลีย์เอเฟเรีย : ใบเรือแล่นลมสีขาว": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049664.webp",
        "เรือแกลลีย์เอเฟเรีย : หัวเรือมังกรดำ": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049667.webp",
        "เรือแกลลีย์เอเฟเรีย : หุ้มเกราะดัดแปลง": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049668.webp",
        "เรือแกลลีย์เอเฟเรีย : ปืนใหญ่เมย์นา": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049669.webp",
        "เรือแกลลีย์เอเฟเรีย : ใบเรือแล่นลมชั้นเมฆ": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049670.webp",
        "ผ้าลินินที่มีเส้นเลือดของพระจันทร์สลักอยู่": icons.get("Moon Vein Flax Fabric x180"),
        "ไม้แปรรูปที่ประกายแสงสีครามเข้ม": icons.get("Deep Tide-Dyed Standardized Timber Square x144"),
        "แท่งเหล็กหินเกลือเจิดจรัส": icons.get("Brilliant Rock Salt Ingot x30"),
        "อัญมณีมุกเจิดจรัส": icons.get("Brilliant Pearl Shard x30"),
        "น้ำตาแห่งทะเลลึก": icons.get("Tear of the Ocean x50"),
        "ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049011.webp",
        "ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย": "https://bdocodex.com/items/new_icon/03_etc/09_petitem/00049009.webp",
        "ใบอนุญาตปรับปรุงส่วนประกอบเรือคาร์แร็คเอเฟเรีย : (ฉุกเฉิน, สมดุล, แข็งแกร่ง, ทนทาน)": "https://s1.pearlcdn.com/KR/Upload/WIKI/996359aeb8f20220616153649695.png",
        "วัตถุโบราณของโจรสลัดค็อกซ์ (ต่อสู้)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005824.webp",
        "วัตถุโบราณของโจรสลัดค็อกซ์(ต่อสู้)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005824.webp",
        "วัตถุโบราณของกลุ่มโจรสลัดค็อกซ์ (ต่อสู้)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005824.webp",
        "วัตถุโบราณของกลุ่มโจรสลัดค็อกซ์(ต่อสู้)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005824.webp",
        "วัตถุโบราณของโจรสลัดค็อกซ์ (การเจรจาระดับสูง)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005823.webp",
        "วัตถุโบราณของโจรสลัดค็อกซ์(การเจรจาระดับสูง)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005823.webp",
        "วัตถุโบราณของกลุ่มโจรสลัดค็อกซ์ (การเจรจาระดับสูง)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005823.webp",
        "วัตถุโบราณของกลุ่มโจรสลัดค็อกซ์(การเจรจาระดับสูง)": "https://bdocodex.com/items/new_icon/03_etc/07_productmaterial/00005823.webp",
    }
    icon_by_thai = {**icons, **icon_by_thai}

    workbook = pd.ExcelFile(WORKBOOK)
    official_tables = pd.read_html(OFFICIAL_WIKI_TH)
    checklist = pd.read_excel(WORKBOOK, sheet_name=1)
    methods = pd.read_excel(WORKBOOK, sheet_name=2)
    gear = pd.read_excel(WORKBOOK, sheet_name=3)
    ships = pd.read_excel(WORKBOOK, sheet_name=4)
    sources = pd.read_excel(WORKBOOK, sheet_name=6)

    items = []
    for idx, row in checklist.iterrows():
        name = clean(row.iloc[2])
        lookup_name = re.sub(r"^\+10\s+", "", name)
        items.append(
            {
                "id": f"item-{idx + 1:02d}",
                "stage": clean(row.iloc[0]),
                "category": clean(row.iloc[1]),
                "name": name,
                "required": int(row.iloc[3]),
                "owned": int(row.iloc[4]),
                "how": clean(row.iloc[7]),
                "notes": clean(row.iloc[8]),
                "infoUrl": clean(row.iloc[9]) or OFFICIAL_WIKI_TH,
                "sourceUrl": clean(row.iloc[10]) or OFFICIAL_WIKI_TH,
                "icon": icon_by_thai.get(lookup_name)
                or icon_by_thai.get(name)
                or next((icons.get(key) for key in icon_keys(name) + icon_keys(lookup_name) if icons.get(key)), ""),
                "routes": (
                    ["balance"]
                    if "สมดุล" in clean(row.iloc[0]) or "⚖" in clean(row.iloc[1])
                    else ["advance"]
                    if "ทนทาน" in clean(row.iloc[0]) or "🏴" in clean(row.iloc[1])
                    else ["advance", "balance"]
                ),
            }
        )

    starting_items = [
        {
            "id": "start-sailboat-license",
            "stage": "ขั้นต่ำ: เริ่มจากใบลงทะเบียนเรือ",
            "category": "🎫",
            "name": "ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย",
            "required": 1,
            "owned": 0,
            "how": "ซื้อจากตลาดซื้อขายรวม, แลกเหรียญตราชาคาทู, แลกเหรียญตราตอบแทนทองคำ [จัดส่งสินค้าราชวัง] 3,000 เหรียญ, หรือให้คนงานสร้างที่เอเฟเรีย",
            "notes": "ใช้เป็นจุดเริ่มสายการค้า: เรือสำเภาเอเฟเรีย → เรือการค้าเอเฟเรีย → คาแร็คทนทาน/สมดุล",
            "infoUrl": FORUM_GUIDE_TH,
            "sourceUrl": FORUM_GUIDE_TH,
            "icon": icon_by_thai["ใบลงทะเบียนเรือ : เรือสำเภาเอเฟเรีย"],
            "routes": ["advance", "balance"],
        },
        {
            "id": "start-frigate-license",
            "stage": "ขั้นต่ำ: เริ่มจากใบลงทะเบียนเรือ",
            "category": "🎫",
            "name": "ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย",
            "required": 1,
            "owned": 0,
            "how": "ซื้อจากตลาดซื้อขายรวม, แลกเหรียญตราตอบแทนทองคำ [จัดส่งสินค้าราชวัง] 12,000 เหรียญ, หรือให้คนงานสร้างที่เอเฟเรีย",
            "notes": "ใช้เป็นจุดเริ่มสายรบ: เรือฟริเกตเอเฟเรีย → เรือแกลลีย์เอเฟเรีย → คาแร็คฉุกเฉิน/แข็งแกร่ง",
            "infoUrl": FORUM_GUIDE_TH,
            "sourceUrl": FORUM_GUIDE_TH,
            "icon": icon_by_thai["ใบลงทะเบียนเรือ : เรือฟริเกตเอเฟเรีย"],
            "routes": ["volante", "valor"],
        },
    ]
    items = starting_items + items

    extra_specs = [
        (4, "(ดัดแปลง) เรือฟริเกตเอเฟเรีย → เรือแกลลีย์เอเฟเรีย", "⚔️", ["volante", "valor"], "galleass"),
        (7, "เรือแกลลีย์เอเฟเรีย → เรือคาร์แร็คเอเฟเรีย : ฉุกเฉิน", "💨", ["volante"], "volante"),
        (8, "เรือแกลลีย์เอเฟเรีย → เรือคาร์แร็คเอเฟเรีย : แข็งแกร่ง", "🛡️", ["valor"], "valor"),
        (10, "อุปกรณ์เรือการค้า: หัวเรือมังกรดำ", "🧩", ["advance", "balance"], "caravel-figurehead"),
        (11, "อุปกรณ์เรือการค้า: หุ้มเกราะดัดแปลง", "🧩", ["advance", "balance"], "caravel-plating"),
        (12, "อุปกรณ์เรือการค้า: ปืนใหญ่เมย์นา", "🧩", ["advance", "balance"], "caravel-cannon"),
        (13, "อุปกรณ์เรือการค้า: ใบเรือแล่นลมชั้นเมฆ", "🧩", ["advance", "balance"], "caravel-sail"),
        (14, "อุปกรณ์เรือแกลลีย์: หัวเรือมังกรดำ", "🧩", ["volante", "valor"], "galleass-figurehead"),
        (15, "อุปกรณ์เรือแกลลีย์: หุ้มเกราะดัดแปลง", "🧩", ["volante", "valor"], "galleass-plating"),
        (16, "อุปกรณ์เรือแกลลีย์: ปืนใหญ่เมย์นา", "🧩", ["volante", "valor"], "galleass-cannon"),
        (17, "อุปกรณ์เรือแกลลีย์: ใบเรือแล่นลมชั้นเมฆ", "🧩", ["volante", "valor"], "galleass-sail"),
        (18, "อุปกรณ์คาแร็ค: หัวเรือของชีโล่", "🔧", ["advance", "balance", "volante", "valor"], "chiro-figurehead"),
        (19, "อุปกรณ์คาแร็ค: ใบเรือของชีโล่", "🔧", ["advance", "balance", "volante", "valor"], "chiro-sail"),
        (20, "อุปกรณ์คาแร็ค: ปืนใหญ่ของชีโล่", "🔧", ["advance", "balance", "volante", "valor"], "chiro-cannon"),
        (21, "อุปกรณ์คาแร็ค: หุ้มเกราะดำของชีโล่", "🔧", ["advance", "balance", "volante", "valor"], "chiro-plating"),
    ]
    for table_idx, stage, category, routes, prefix in extra_specs:
        for item in rows_to_items(official_tables[table_idx], stage, category, routes, prefix, icon_by_thai):
            merge_item(items, item)

    payload = {
        "meta": {
            "title": "BDO Carrack Planner",
            "sourceWorkbook": str(WORKBOOK),
            "officialWiki": OFFICIAL_WIKI_TH,
            "generatedFrom": "Pearl Abyss official wiki + local workbook",
        },
        "items": items,
        "methods": [
            {
                "group": clean(row.iloc[0]),
                "appliesTo": clean(row.iloc[1]),
                "summary": clean(row.iloc[2]),
                "priority": clean(row.iloc[3]),
            }
            for _, row in methods.iterrows()
        ],
        "gear": [
            {
                "order": int(row.iloc[0]),
                "target": clean(row.iloc[1]),
                "name": clean(row.iloc[2]),
                "quantity": int(row.iloc[3]),
                "note": clean(row.iloc[4]),
            }
            for _, row in gear.iterrows()
        ],
        "ships": [
            {
                "name": clean(row.iloc[0]),
                "alias": clean(row.iloc[1]),
                "from": clean(row.iloc[2]),
                "strength": clean(row.iloc[3]),
                "fit": clean(row.iloc[4]),
                "summary": clean(row.iloc[5]),
            }
            for _, row in ships.iterrows()
        ],
        "sources": [
            {"name": clean(row.iloc[0]), "url": clean(row.iloc[1]), "use": clean(row.iloc[2])}
            for _, row in sources.iterrows()
        ]
        + [
            {
                "name": "Pearl Abyss Forum - เจาะลึกเรื่องการสร้างเรือใหม่",
                "url": FORUM_GUIDE_TH,
                "use": "เส้นทางเริ่มต้นจากใบลงทะเบียนเรือสำเภา/ฟริเกต และคำอธิบายอุปกรณ์ติดตั้งเรือ",
            }
        ],
        "forumAssets": forum_images(),
    }

    json_out = ROOT / "data" / "items.json"
    js_out = ROOT / "data" / "items.js"
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    json_out.write_text(text, encoding="utf-8")
    js_out.write_text(f"window.BDO_CARRACK_DATA = {text};\n", encoding="utf-8")
    print(f"Wrote {json_out} and {js_out} with {len(items)} items")


if __name__ == "__main__":
    main()
