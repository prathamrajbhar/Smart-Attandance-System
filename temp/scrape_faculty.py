import csv
import html
import re
import urllib.request
from urllib.parse import urljoin

BASE_URL = "https://uvpce.guni.ac.in"
START_URL = f"{BASE_URL}/people/category/faculty"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def get_name_initials(name, email=""):
    if email and '@' in email:
        email_prefix = email.split('@')[0]
        letters_only = re.sub(r'[^a-zA-Z]', '', email_prefix)
        if letters_only:
            return letters_only.lower()
            
    clean_name = re.sub(r'^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.|Er\.)\s+', '', name, flags=re.IGNORECASE)
    initials = ''.join(word[0] for word in clean_name.split() if word and word[0].isalpha())
    return initials.lower()

def fetch_department_urls():
    print(f"Fetching main page: {START_URL}")
    raw_html = fetch_url(START_URL)
    
    dept_urls = []
    card_pattern = r'<div class="card">\s*<a href="([^"]+)">\s*<h6[^>]*>\s*([^<]+)\s*</h6>\s*</a>\s*</div>'
    matches = re.findall(card_pattern, raw_html, re.IGNORECASE)
    
    for href, dept_name in matches:
        dept_name = html.unescape(dept_name.strip())
        full_url = urljoin(BASE_URL, href)
        if '/people/faculty-departments/' in full_url or '/people/category/' in full_url:
            dept_urls.append((dept_name, full_url))
            
    print(f"Found {len(dept_urls)} department links.")
    return dept_urls

def parse_faculty_cards(raw_html, default_dept_name):
    h1_match = re.search(r'<h1[^>]*class="[^"]*line-bottom[^"]*"[^>]*>\s*([^<]+)\s*</h1>', raw_html, re.IGNORECASE)
    dept_name = html.unescape(h1_match.group(1).strip()) if h1_match else default_dept_name

    faculty_list = []
    card_blocks = re.findall(r'<div class="media table-center1">([\s\S]*?)</div>\s*</div>\s*</div>', raw_html)
    
    for block in card_blocks:
        h5_match = re.search(r'<h5>\s*([^<]+)\s*</h5>', block)
        if not h5_match:
            continue
        name = html.unescape(h5_match.group(1).strip())
        
        h6_matches = re.findall(r'<h6>\s*([^<]+)\s*</h6>', block)
        title = ""
        experience = ""
        for h6 in h6_matches:
            txt = html.unescape(h6.strip())
            if "Experience" in txt:
                exp_match = re.search(r'(\d+)', txt)
                if exp_match:
                    experience = exp_match.group(1)
            else:
                title = txt
                
        email = ""
        email_match = re.search(r'mailto:([^\s\'"]+)', block)
        if email_match:
            email = html.unescape(email_match.group(1).strip())
        else:
            email_text_match = re.search(r'<a[^>]*class="email-font"[^>]*>\s*([^<]+)\s*</a>', block)
            if email_text_match:
                email = html.unescape(email_text_match.group(1).strip())
                
        profile_url = ""
        profile_match = re.search(r'href="(/people/faculty/[^"]+)"', block)
        if profile_match:
            profile_url = profile_match.group(1).strip()
            
        faculty_list.append({
            'name': name,
            'title': title,
            'experience_years': experience,
            'email': email,
            'name_initials': get_name_initials(name, email),
            'profile_url': profile_url,
            'department': dept_name
        })
        
    return faculty_list

def main():
    dept_urls = fetch_department_urls()
    
    seen_keys = set()
    all_faculty = []
    
    for dept_name, url in dept_urls:
        print(f"Scraping department: '{dept_name}' ({url})")
        try:
            raw_html = fetch_url(url)
            members = parse_faculty_cards(raw_html, dept_name)
            print(f"  Found {len(members)} faculty members.")
            for m in members:
                key = m['email'].lower() if m['email'] else (m['profile_url'] or (m['name'].lower(), m['department']))
                if key in seen_keys:
                    print(f"  Skipping duplicate: {m['name']} ({m['email'] or m['profile_url']})")
                    continue
                seen_keys.add(key)
                all_faculty.append(m)
        except Exception as e:
            print(f"  Error scraping {url}: {e}")

    output_path = '/home/pratham/Disk2/Projects/Smart Attandance System/temp/faculty.csv'
    fieldnames = ['name', 'title', 'experience_years', 'email', 'name_initials', 'profile_url', 'department']
    
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for faculty in all_faculty:
            writer.writerow(faculty)
            
    print(f"\nScraping complete!")
    print(f"Total unique faculty members saved: {len(all_faculty)}")
    print(f"CSV file path: {output_path}")

if __name__ == '__main__':
    main()