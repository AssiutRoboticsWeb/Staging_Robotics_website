import shutil

# Copy the CSS directly
shutil.copyfile(
    'assiutroboticselectrical.netlify.app_2026-04-26_03-12-03/assets/index-BaUWR-RJ.css', 
    'styles.css'
)

# Read the extracted middle HTML
with open('extracted_middle.html', 'r', encoding='utf-8') as f:
    middle_html = f.read()

# Read the main project index.html layout template (we'll generate it directly here)
html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assiut Robotics - AC Period</title>
    
    <!-- Standard Site Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Standard Global CSS -->
    <link rel="stylesheet" href="../main/footerAndheader.css">
    
    <!-- Tailwind CSS for AC Period -->
    <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-50">

    <!-- Global Header -->
    <div id="myUniqueHeaderID"></div>

    <!-- Main Content from AC Period -->
    <main class="page-enter">
        {content}
    </main>

    <!-- Global Footer -->
    <div id="myUniqueFooterID"></div>

    <!-- Standard Site Scripts -->
    <script src="../main/language-manager.js"></script>
    <script src="../main/footerAndheader.js" defer></script>
    
    <!-- Vanilla JS for Carousels & Interactions -->
    <script src="script.js"></script>
</body>
</html>
"""

final_html = html_template.replace('{content}', middle_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print("Generated index.html and styles.css!")
