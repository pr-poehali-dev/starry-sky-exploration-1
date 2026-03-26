"""
Поиск шин на baza.drom.ru по параметрам: ширина, высота, радиус, сезонность.
Возвращает список найденных объявлений.
"""

import json
import re
import urllib.request
import urllib.parse
from html.parser import HTMLParser


SEASON_MAP = {
    "summer": "2",
    "winter": "1",
    "allseason": "3",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9",
}

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def build_url(params: dict) -> str:
    base = "https://baza.drom.ru/sell/wheel/"
    parts = []
    if params.get("width"):
        parts.append(f"width-{params['width']}")
    if params.get("height"):
        parts.append(f"height-{params['height']}")
    if params.get("radius"):
        parts.append(f"radius-{params['radius']}")
    if params.get("season") and params["season"] in SEASON_MAP:
        parts.append(f"season-{SEASON_MAP[params['season']]}")
    path = "/".join(parts)
    return f"{base}{path}/" if path else base


class TireParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tires = []
        self._current = {}
        self._in_title = False
        self._in_price = False
        self._in_seller = False
        self._in_desc = False
        self._depth = 0
        self._item_depth = None
        self._capture = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        cls = attrs_dict.get("class", "")

        if "bull-item__image-cell" in cls or "bull-item" in cls and "bull-item__" not in cls:
            href = attrs_dict.get("href", "")
            if href and "/sell/wheel/" in href and "bull-item__" not in cls:
                if self._current:
                    self._save_current()
                self._current = {"url": href if href.startswith("http") else f"https://baza.drom.ru{href}"}
                self._item_depth = self._depth

        if "bull-item__title" in cls:
            self._capture = "title"
        elif "bull-item__price" in cls or "price-block" in cls:
            self._capture = "price"
        elif "bull-item__location" in cls or "seller-info" in cls:
            self._capture = "seller"
        elif "bull-item__description" in cls or "description-block" in cls:
            self._capture = "desc"

        self._depth += 1

    def handle_endtag(self, tag):
        self._depth -= 1
        self._capture = None

    def handle_data(self, data):
        text = data.strip()
        if not text or not self._capture:
            return
        if self._capture == "title" and text:
            self._current["title"] = self._current.get("title", "") + " " + text
        elif self._capture == "price" and re.search(r"\d", text):
            if "price" not in self._current:
                self._current["price"] = text
        elif self._capture == "seller" and text:
            self._current["seller"] = text
        elif self._capture == "desc" and text:
            self._current["desc"] = self._current.get("desc", "") + " " + text

    def _save_current(self):
        if self._current.get("title") or self._current.get("price"):
            self.tires.append(dict(self._current))
        self._current = {}


def parse_tire(raw: dict, idx: int, search_params: dict) -> dict:
    title = raw.get("title", "").strip()
    price_raw = raw.get("price", "").strip()
    price_num = int(re.sub(r"[^\d]", "", price_raw)) if re.search(r"\d", price_raw) else 0
    price_str = f"{price_num:,}".replace(",", " ") + " ₽" if price_num else price_raw or "цена не указана"

    parts = re.split(r"[\s/]+", title)
    brand = parts[0] if parts else "—"
    model = " ".join(parts[1:3]) if len(parts) > 1 else "—"

    desc = raw.get("desc", "")
    width_m = re.search(r"(\d{3})/", desc + " " + title)
    height_m = re.search(r"/(\d{2,3})\s*[Rr]", desc + " " + title)
    radius_m = re.search(r"[Rr](\d{2})", desc + " " + title)

    return {
        "id": f"tire_{idx}",
        "brand": brand,
        "model": model,
        "width": width_m.group(1) if width_m else search_params.get("width", "—"),
        "height": height_m.group(1) if height_m else search_params.get("height", "—"),
        "radius": radius_m.group(1) if radius_m else search_params.get("radius", "—"),
        "season": search_params.get("season", ""),
        "price": price_str,
        "priceNum": price_num,
        "seller": raw.get("seller", "Продавец").strip() or "Продавец",
        "url": raw.get("url", ""),
        "condition": "Б/у",
    }


def fetch_tires(url: str) -> list:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
    except Exception:
        return []

    parser = TireParser()
    parser.feed(html)

    if parser._current:
        parser._save_current()

    return parser.tires


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}
    url = build_url(params)

    raw_tires = fetch_tires(url)
    tires = [parse_tire(t, i, params) for i, t in enumerate(raw_tires[:30])]

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"tires": tires, "source_url": url, "count": len(tires)}, ensure_ascii=False),
    }
