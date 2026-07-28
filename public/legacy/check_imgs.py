import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

imgs = re.findall(r'src=\"([^\"]+)\"', html)
print(set(imgs))
