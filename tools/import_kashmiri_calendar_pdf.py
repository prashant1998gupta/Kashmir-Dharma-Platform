import calendar
import json
import re
import tempfile
import urllib.request
from datetime import date
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "data" / "kashmiri-calendar" / "Kashmiri Hindu Calendar 2026-27.pdf"
OUT_DIR = ROOT / "data" / "kashmiri-calendar"

SOURCE_URL = "https://www.kashmiri-pandit.org/koshurcalendar/2026/Kashmiri%20Hindu%20Calendar%202026-27.pdf"

MONTH_NUM = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12,
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Sept": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}

ENGLISH_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

TITHIS = {
    "Amavasya", "Okdoh", "Dwitya", "Tritya", "Choram", "Paancham", "Shishthi", "Satam",
    "Ashtami", "Navum", "Dhashmi", "Ekadashi", "Dwadashi", "Triyodashi", "Chaturdashi", "Poornima",
}

IMPORTANCE_RULES = [
    (2, ["Navreh", "Herath", "Mata Kheer Bhawani Yatra", "Diwali", "Khetsi Mavas"]),
    (1, ["Sankranti", "Ashtami", "Ekadashi", "Poornima", "Amavasya", "Janamashtami", "Ram Navmi", "Durga"]),
]


def dmy(dt: date) -> str:
    return dt.strftime("%d-%m-%Y")


def page_month_year(first_line: str) -> tuple[int, int]:
    for month_name in ENGLISH_MONTHS:
        match = re.search(rf"\b{month_name}\s+(\d{{4}})\b", first_line)
        if match:
            return MONTH_NUM[month_name], int(match.group(1))
    raise ValueError(f"Cannot find Gregorian month/year in page heading: {first_line!r}")


def infer_year(month_num: int, page_month: int, page_year: int) -> int:
    if month_num - page_month > 6:
        return page_year - 1
    if page_month - month_num > 6:
        return page_year + 1
    return page_year


def parse_range_date(text: str, page_month: int, page_year: int) -> date:
    match = re.match(r"([A-Za-z]+)\s+(\d{1,2})", text.strip())
    if not match:
        raise ValueError(f"Cannot parse range date: {text!r}")
    month_num = MONTH_NUM[match.group(1)]
    year = infer_year(month_num, page_month, page_year)
    return date(year, month_num, int(match.group(2)))


def parse_ranges(text: str, page_month: int, page_year: int) -> list[dict]:
    rows = []
    for line in text.splitlines():
        line = line.strip()
        line = re.sub(r"^(?:\d{1,2}\s+)+(?=[A-Za-z-]+ .+ Paksha \()", "", line)
        if "Paksha (" not in line and not line.startswith("Panchak ("):
            continue

        if line.startswith("Panchak ("):
            match = re.match(r"Panchak \(([A-Za-z]+)\s+(\d{1,2})\s+[–-]\s+(\d{1,2})\)", line)
            if not match:
                continue
            month_num = MONTH_NUM[match.group(1)]
            year = infer_year(month_num, page_month, page_year)
            rows.append({
                "startDate": dmy(date(year, month_num, int(match.group(2)))),
                "endDate": dmy(date(year, month_num, int(match.group(3)))),
                "monthName": "Panchak",
                "imp": "2",
            })
            continue

        match = re.match(r"(.+? Paksha) \(([^)]+)\)", line)
        if not match:
            continue
        name = match.group(1)
        span = match.group(2)
        if "-" not in span and "–" not in span:
            continue
        start_text, end_text = re.split(r"\s*[–-]\s*", span, maxsplit=1)
        start = parse_range_date(start_text, page_month, page_year)

        if re.match(r"^\d{1,2}$", end_text.strip()):
            end = date(start.year, start.month, int(end_text.strip()))
        else:
            end = parse_range_date(end_text, page_month, page_year)

        rows.append({
            "startDate": dmy(start),
            "endDate": dmy(end),
            "monthName": name,
        })
    return rows


def word_center(word: dict) -> tuple[float, float]:
    return (word["x0"] + word["x1"]) / 2, (word["top"] + word["bottom"]) / 2


def cluster_positions(values: list[float], tolerance: float = 12) -> list[float]:
    clusters: list[list[float]] = []
    for value in sorted(values):
        if not clusters or abs(value - sum(clusters[-1]) / len(clusters[-1])) > tolerance:
            clusters.append([value])
        else:
            clusters[-1].append(value)
    return [sum(cluster) / len(cluster) for cluster in clusters]


def is_day_number(word: dict, max_day: int) -> bool:
    if not word["text"].isdigit():
        return False
    number = int(word["text"])
    if number < 1 or number > max_day:
        return False
    if word["bottom"] - word["top"] < 12:
        return False
    x, y = word_center(word)
    return 50 <= x <= 750 and 100 <= y <= 540


def assign_importance(events: str) -> str | None:
    for importance, labels in IMPORTANCE_RULES:
        if any(label in events for label in labels):
            return str(importance)
    return None


def clean_cell_text(words: list[dict]) -> str:
    by_line: dict[int, list[dict]] = {}
    for word in words:
        line_key = round(word["top"] / 8)
        by_line.setdefault(line_key, []).append(word)

    parts = []
    for line in sorted(by_line.values(), key=lambda items: min(item["top"] for item in items)):
        text = " ".join(item["text"] for item in sorted(line, key=lambda item: item["x0"]))
        parts.append(text)

    raw = " ".join(parts)
    raw = re.sub(r"\s+", " ", raw).strip()
    raw = raw.replace("Mata Kheer Bhawani Yatra Zyeth Ashtami", "Mata Kheer Bhawani Yatra, Zyeth Ashtami")
    raw = raw.replace("Mata Kheer Bhawani Yatra Zyeth", "Mata Kheer Bhawani Yatra, Zyeth")
    raw = raw.replace("Roop Bhawani Prakash Utsav", "Roop Bhawani Prakash Utsav")
    raw = raw.replace("Ram Navmi Durga Ashtami", "Ram Navmi, Durga Ashtami")
    raw = raw.replace("Durga Ashtami", "Durga Ashtami")
    raw = raw.replace("Navreh Navratra Starts", "Navreh, Navratra Starts")
    raw = raw.replace("Sankranti Vaisakhi", "Sankranti, Vaisakhi")
    raw = raw.replace("Sankranti Sonth", "Sankranti, Sonth")
    raw = raw.replace("Sankranti Harud", "Sankranti, Harud")
    raw = raw.replace("Krishna Janam Ashtami", "Janmashtami")
    raw = raw.replace("Maha Shivratri", "Herath (Maha Shivratri)")

    # Put the final tithi after special labels, matching the legacy JSON style.
    tokens = raw.split()
    if tokens and tokens[-1] in TITHIS:
        tithi = tokens[-1]
        special = " ".join(tokens[:-1]).strip()
        result = f"{special}, {tithi}" if special else tithi
        result = result.replace("Zyeth, Ashtami", "Zyeth Ashtami")
        result = result.replace("Durga, Ashtami", "Durga Ashtami")
        return result
    return raw


def parse_daily_page(page, month_num: int, year: int) -> list[dict]:
    max_day = calendar.monthrange(year, month_num)[1]
    words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False)
    day_words = [word for word in words if is_day_number(word, max_day)]

    # Prefer the printed day number positions: one per day in the actual month.
    by_day: dict[int, dict] = {}
    for word in day_words:
        day = int(word["text"])
        if day not in by_day or word["top"] < by_day[day]["top"]:
            by_day[day] = word
    if len(by_day) != max_day:
        missing = sorted(set(range(1, max_day + 1)) - set(by_day))
        raise ValueError(f"{year}-{month_num:02d}: missing day numbers {missing}")

    header_words = [word for word in words if word["text"] in {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}]
    col_centers = [word_center(word)[0] for word in sorted(header_words, key=lambda word: word["x0"])]
    row_tops = cluster_positions([word["top"] for word in by_day.values()], tolerance=18)
    if len(col_centers) < 7:
        # Calendar rows with partial first/last weeks still need full column centers.
        col_centers = cluster_positions([word_center(word)[0] for word in by_day.values()], tolerance=26)
    col_centers = sorted(col_centers)[:7]
    row_tops = sorted(row_tops)

    x_edges = [0]
    for left, right in zip(col_centers, col_centers[1:]):
        x_edges.append((left + right) / 2)
    x_edges.append(800)

    y_edges = [max(100, row_tops[0] - 2)]
    for top in row_tops[1:]:
        y_edges.append(top - 2)
    y_edges.append(min(555, row_tops[-1] + 86))

    rows = []
    for day in range(1, max_day + 1):
        day_word = by_day[day]
        x, _ = word_center(day_word)
        col = min(range(len(col_centers)), key=lambda idx: abs(col_centers[idx] - x))
        row = min(range(len(row_tops)), key=lambda idx: abs(row_tops[idx] - day_word["top"]))
        x0, x1 = x_edges[col], x_edges[col + 1]
        y0, y1 = y_edges[row], y_edges[row + 1]

        cell_words = []
        for word in words:
            wx, wy = word_center(word)
            if not (x0 <= wx <= x1 and y0 <= wy <= y1):
                continue
            if word is day_word:
                continue
            if word["text"].isdigit():
                continue
            if word["text"] in {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}:
                continue
            if "Compiled" in word["text"] or "lalit@koul.org" in word["text"]:
                continue
            cell_words.append(word)

        events = clean_cell_text(cell_words)
        row_data = {
            "date": dmy(date(year, month_num, day)),
            "events": events,
        }
        importance = assign_importance(events)
        if importance:
            row_data["imp"] = importance
        rows.append(row_data)
    return rows


def main() -> None:
    temp_pdf = None
    pdf_path = PDF_PATH
    if not pdf_path.exists():
        temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_pdf.close()
        request = urllib.request.Request(
            SOURCE_URL,
            headers={"User-Agent": "Mozilla/5.0 (calendar data verification script)"},
        )
        with urllib.request.urlopen(request, timeout=45) as response:
            Path(temp_pdf.name).write_bytes(response.read())
        pdf_path = Path(temp_pdf.name)

    daily_rows = []
    range_rows_by_key = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page_index in range(1, 15):
            page = pdf.pages[page_index]
            text = page.extract_text(x_tolerance=1, y_tolerance=3) or ""
            first_line = text.splitlines()[0]
            month_num, year = page_month_year(first_line)
            daily_rows.extend(parse_daily_page(page, month_num, year))
            for row in parse_ranges(text, month_num, year):
                key = (row["startDate"], row["endDate"], row["monthName"])
                range_rows_by_key[key] = row

    month_rows = sorted(
        range_rows_by_key.values(),
        key=lambda row: tuple(reversed(row["startDate"].split("-"))),
    )

    (OUT_DIR / "26_27.json").write_text(json.dumps(daily_rows, indent=2) + "\n", encoding="utf-8")
    (OUT_DIR / "months_26_27.json").write_text(json.dumps(month_rows, indent=2) + "\n", encoding="utf-8")

    if temp_pdf:
        Path(temp_pdf.name).unlink(missing_ok=True)

    print(f"Wrote {len(daily_rows)} daily rows from {SOURCE_URL}")
    print(f"Wrote {len(month_rows)} month/panchak rows")


if __name__ == "__main__":
    main()
