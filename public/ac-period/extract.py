import re
import os

source_path = 'assiutroboticselectrical.netlify.app_2026-04-26_03-12-03/index.html'
with open(source_path, 'r', encoding='utf-8') as f:
    html = f.read()

# We want the content inside <div id="root"><div class="min-h-screen bg-gray-50 page-enter">...</div></div>
# But without the <nav> and <footer>
# The structure is <nav>...</nav><div class="min-h-screen">...content...</div><footer>...</footer>
nav_match = re.search(r'<nav.*?</nav>', html, re.DOTALL)
footer_match = re.search(r'<footer.*?</footer>', html, re.DOTALL)

if nav_match and footer_match:
    print("Found nav and footer")
    # Extract the part between nav and footer
    start_idx = nav_match.end()
    end_idx = footer_match.start()
    middle = html[start_idx:end_idx]
    
    # Save the extracted middle to a temporary file for examination
    with open('extracted_middle.html', 'w', encoding='utf-8') as f:
        f.write(middle)
    print("Extracted successfully!")
else:
    print("Could not find nav or footer")
