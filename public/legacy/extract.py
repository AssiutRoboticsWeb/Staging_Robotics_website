import re
import os

source_path = 'hossamhamzahm.github.io_2026-04-26_03-18-06/Assiut-Robotics.html'
with open(source_path, 'r', encoding='utf-8') as f:
    html = f.read()

# We want the content after </nav> and before the first <script> tag at the bottom.
nav_match = re.search(r'</nav>', html)
script_match = re.search(r'<script', html)

# Let's find the script match *after* the nav
script_idx = html.find('<script', nav_match.end())

if nav_match and script_idx != -1:
    start_idx = nav_match.end()
    middle = html[start_idx:script_idx].strip()
    
    # We will generate the final HTML
    html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assiut Robotics - Legacy</title>
    
    <!-- Standard Site Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Bootstrap 5 for the legacy site layout -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    
    <!-- Standard Global CSS -->
    <link rel="stylesheet" href="../main/footerAndheader.css">
    
    <!-- Custom Legacy CSS -->
    <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-light">

    <!-- Global Header -->
    <div id="myUniqueHeaderID"></div>

    <!-- Main Content from Legacy Site -->
    <main>
        {content}
    </main>

    <!-- Global Footer -->
    <div id="myUniqueFooterID"></div>

    <!-- Standard Site Scripts -->
    <script src="../main/language-manager.js"></script>
    <script src="../main/footerAndheader.js" defer></script>
    
    <!-- Bootstrap JS for Carousels -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom Legacy JS -->
    <script src="script.js"></script>
</body>
</html>
"""
    final_html = html_template.replace('{content}', middle)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(final_html)
    print("Extracted HTML successfully!")
else:
    print("Could not find nav or script")

# Also copy CSS and JS
with open('hossamhamzahm.github.io_2026-04-26_03-18-06/Assiut-Robotics/css/main.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('hossamhamzahm.github.io_2026-04-26_03-18-06/Assiut-Robotics/js/index.js', 'r', encoding='utf-8') as f:
    js = f.read()
with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Extracted CSS and JS successfully!")
