import csv
import html
import os
import re
import urllib.request

BASE_DIR = '/home/pratham/Disk2/Projects/Smart Attandance System/temp'
LIST_FILE = os.path.join(BASE_DIR, 'syllabuslist.txt')
MASTER_CSV = os.path.join(BASE_DIR, 'subject.csv')
SUBJECTS_DIR = os.path.join(BASE_DIR, 'subjects')

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

BRANCH_SLUGS = {
    'bachelor-of-technology-in-computer-engineering': 'ce',
    'bachelor-of-technology-in-information-technology': 'it',
    'bachelor-of-technology-in-electronics-and-communication-engineering': 'ece',
    'bachelor-of-technology-in-mechatronics-engineering': 'me',
    'bachelor-of-technology-in-computer-engineering-artificial-intelligence': 'ce-ai',
    'btech-computer-science-and-business-systems': 'csbs',
}

ROMAN = {'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7, 'viii': 8}

FIELDNAMES = [
    'branch', 'branch_slug', 'semester', 'subject_name', 'subject_code',
    'subject_type', 'credits', 'comment', 'details_url', 'attachment_url'
]


def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode('utf-8', errors='ignore')


def slugify(text):
    text = html.unescape(text).strip().lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def clean(text):
    return html.unescape(re.sub(r'\s+', ' ', text)).strip()


def parse_semester_rows(chunk):
    rows = []
    tr_matches = re.findall(r'<tr>([\s\S]*?)</tr>', chunk, re.IGNORECASE)
    for tr in tr_matches:
        tds = re.findall(r'<td[^>]*>([\s\S]*?)</td>', tr, re.IGNORECASE)
        if len(tds) < 4:
            continue
        name_html = tds[0]
        details_url = ''
        href_match = re.search(r'href="(/syllabus/[^"]+)"', name_html)
        if href_match:
            details_url = href_match.group(1)
        name = clean(re.sub(r'<[^>]+>', ' ', name_html))
        if not name or name.lower() in ('subject name',):
            continue

        attachment_url = ''
        pdf_match = re.search(r'href="(https?://[^"]+\.pdf)"', tds[5] if len(tds) > 5 else tr, re.IGNORECASE)
        if pdf_match:
            attachment_url = html.unescape(pdf_match.group(1))

        rows.append({
            'subject_name': name,
            'subject_code': clean(tds[2]) if len(tds) > 2 else '',
            'subject_type': clean(tds[1]) if len(tds) > 1 else '',
            'credits': clean(tds[3]) if len(tds) > 3 else '',
            'comment': clean(tds[4]) if len(tds) > 4 else '',
            'details_url': details_url,
            'attachment_url': attachment_url,
        })
    return rows


def parse_syllabus_page(raw_html, url):
    h1_match = re.search(r'<h1[^>]*>\s*<span>\s*([^<]+?)\s*</span>', raw_html, re.IGNORECASE)
    branch = clean(h1_match.group(1)) if h1_match else ''

    path = url.rstrip('/').split('/')
    url_slug = path[-2] if len(path) >= 2 else ''
    branch_slug = BRANCH_SLUGS.get(url_slug, slugify(url_slug))

    subjects = []
    positions = [(m.start(), m.group(1)) for m in re.finditer(r'id="semester-(i|ii|iii|iv|v|vi|vii|viii)"', raw_html)]
    for idx, (pos, roman) in enumerate(positions):
        end = positions[idx + 1][0] if idx + 1 < len(positions) else len(raw_html)
        chunk = raw_html[pos:end]
        for row in parse_semester_rows(chunk):
            row.update({
                'branch': branch,
                'branch_slug': branch_slug,
                'semester': ROMAN[roman],
            })
            subjects.append(row)
    return subjects


def main():
    with open(LIST_FILE, encoding='utf-8') as f:
        urls = [line.strip() for line in f if line.strip()]

    all_subjects = []
    for url in urls:
        print(f"Scraping: {url}")
        try:
            raw_html = fetch_url(url)
            subjects = parse_syllabus_page(raw_html, url)
            print(f"  Found {len(subjects)} subjects.")
            all_subjects.extend(subjects)
        except Exception as e:
            print(f"  Error: {e}")

    with open(MASTER_CSV, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=FIELDNAMES)
        writer.writeheader()
        for row in all_subjects:
            writer.writerow(row)
    print(f"\nMaster CSV written: {MASTER_CSV} ({len(all_subjects)} rows)")

    file_count = 0
    seen_files = set()
    for row in all_subjects:
        branch_dir = os.path.join(SUBJECTS_DIR, row['branch_slug'])
        filename = f"sem{row['semester']}.csv"
        filepath = os.path.join(branch_dir, filename)
        if filepath not in seen_files:
            seen_files.add(filepath)
            os.makedirs(branch_dir, exist_ok=True)
            with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=FIELDNAMES)
                writer.writeheader()
            file_count += 1
        with open(filepath, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=FIELDNAMES)
            writer.writerow(row)
    print(f"Per-semester CSVs written: {file_count} files under {SUBJECTS_DIR}")


if __name__ == '__main__':
    main()
