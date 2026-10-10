import re
import json

with open("/tmp/hello_full.html") as f:
    html = f.read()

print("File size:", len(html))

# 1. Backed by the best
bbb_idx = html.find("backed by the best")
if bbb_idx != -1:
    sub = html[bbb_idx:bbb_idx+20000]
    logos = re.findall(r'src=["\'](https://[^"\']+)["\']', sub)
    print("\n--- BBB LOGOS ---")
    for l in set(logos):
        print(l)

# 2. Accordion section
acc_idx = html.find("SAY HELLO TO our brands")
if acc_idx != -1:
    sub = html[acc_idx:acc_idx+35000]
    items = re.findall(r'<div class="vr-accordion[^"]*"([\s\S]*?)<\/a>', sub)
    print("\n--- ACCORDION ITEMS ---", len(items))
    for i, it in enumerate(items):
        bg = re.findall(r'url\([\'"]?([^\'"]+)[\'"]?\)', it)
        text = re.sub(r'<[^>]+>', ' ', it)
        text = ' '.join(text.split())
        print(f"\nItem {i}: text={text} bg={bg}")

# 3. Testimonials
test_idx = html.find("CMOs say")
if test_idx != -1:
    sub = html[test_idx-200:test_idx+15000]
    items = re.findall(r'<div class="hs-slider-item[^"]*"([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>', sub)
    print("\n--- TESTIMONIAL ITEMS ---", len(items))
    for i, it in enumerate(items):
        text = re.sub(r'<[^>]+>', ' ', it)
        text = ' '.join(text.split())
        print(f"Testimonial {i}: {text[:200]}")

