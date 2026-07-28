const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'styles.css');
const jsPath = path.join(__dirname, 'script.js');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Revert responsive classes back to original fixed ones
// We want to remove the 'md:' prefixes and the extra responsive classes because we are using a strict 1920x1080 scaled canvas now.

// Fix logos - revert to standard
html = html.replace(/<div class="absolute top-[^>]*z-50">\s*<img src="\.\/images\/leaders-league\.png" class="h-[^>]*w-auto object-contain" alt="Leaders League">\s*<\/div>/g, 
  '<div class="absolute top-8 left-8 z-50">\n        <img src="./images/leaders-league.png" class="h-12 w-auto object-contain" alt="Leaders League">\n      </div>');
html = html.replace(/<div class="absolute top-[^>]*z-50">\s*<img src="\.\/images\/ylf\.png" class="h-[^>]*w-auto object-contain" alt="YLF">\s*<\/div>/g, 
  '<div class="absolute top-8 right-8 z-50">\n        <img src="./images/ylf.png" class="h-12 w-auto object-contain" alt="YLF">\n      </div>');
html = html.replace(/<div class="absolute top-[^>]*z-50">\s*<img src="\.\/images\/assiut-robotics\.png" class="h-[^>]*w-auto object-contain" alt="Assiut Robotics">\s*<\/div>/g, 
  '<div class="absolute top-6 left-1/2 -translate-x-1/2 z-50">\n        <img src="./images/assiut-robotics.png" class="h-16 w-auto object-contain" alt="Assiut Robotics">\n      </div>');

// Revert main container paddings
html = html.replace(/class="flex flex-col items-center md:justify-center flex-1 px-4 md:px-6 w-full max-w-5xl mx-auto pt-24 md:pt-\[60px\] pb-10 md:pb-0"( class="pt-24 md:pt-\[60px\] pb-10 md:pb-0")?/g, 
  'class="flex flex-col items-center justify-center flex-1 px-6 max-w-5xl mx-auto" style="padding-top:60px"');
html = html.replace(/class="flex flex-col items-center md:justify-center flex-1 px-4 md:px-6 w-full max-w-5xl mx-auto pt-24 md:pt-\[60px\] pb-10 md:pb-0"/g, 
  'class="flex flex-col items-center justify-center flex-1 px-6 max-w-5xl mx-auto" style="padding-top:60px"');

html = html.replace(/class="flex flex-col items-center justify-center flex-1 px-6" class="mt-12 md:-mt-8 mb-10 w-full"/g, 
  'class="flex flex-col items-center justify-center flex-1 px-6" style="margin-top:-30px;margin-bottom:40px"');
html = html.replace(/class="flex flex-col items-center justify-center flex-1 px-6" class="mt-12 md:-mt-8 mb-10 w-full"/g, 
  'class="flex flex-col items-center justify-center flex-1 px-6" style="margin-top:-30px;margin-bottom:40px"');

// Revert bottom texts
html = html.replace(/class="sc absolute bottom-8 md:bottom-5 left-0 right-0 text-center"/g, 'class="sc absolute bottom-5 left-0 right-0 text-center"');

// Add scaler wrapper
if (!html.includes('id="presentation-area"')) {
    html = html.replace('<div id="slides-wrapper" class="flex h-screen">', 
      '<div id="presentation-area" style="position: absolute; top: 50%; left: 50%; width: 1920px; height: 1080px; transform-origin: center; transform: translate(-50%, -50%) scale(1);">\n  <div id="slides-wrapper" class="flex w-full h-full">');
    html = html.replace(/<\/body>/, '  </div>\n</body>'); // Close presentation-area (will fix tag balance carefully below)
}

// Ensure the presentation-area div closes correctly before body
if(html.includes('<div id="presentation-area"')) {
  // Let's just fix it with a regex replacement
  html = html.replace(/<div id="slides-wrapper"[^>]*>[\s\S]*?(<script src="https:\/\/code.jquery.com)/, function(match, p1) {
    // Actually wait, script is in head. 
    return match;
  });
  
  // A safer way to wrap slides-wrapper:
  // Let's restore the original slides-wrapper line:
  html = html.replace(/<div id="presentation-area"[^>]*>\s*<div id="slides-wrapper" class="flex w-full h-full">/g, '<div id="slides-wrapper" class="flex w-full h-full">');
  // Add it fresh
  html = html.replace('<div id="slides-wrapper" class="flex h-screen">', '<div id="presentation-area" style="position: absolute; top: 50%; left: 50%; width: 1920px; height: 1080px; transform-origin: center; transform: translate(-50%, -50%) scale(1);">\n    <div id="slides-wrapper" class="flex" style="width: 100%; height: 100%;">');
  
  // Find the end of slides-wrapper. It's right before </body> or scripts if any.
  // We'll just replace </body> with </div></body>
  // First ensure we only have one extra </div>
  html = html.replace(/<\/div>\s*<\/body>/, '</div>\n</body>');
}

fs.writeFileSync(indexPath, html, 'utf8');

// 2. Update CSS for .slide
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/\.slide \{[\s\S]*?\}/, `.slide {
     width: 1920px;
     height: 1080px;
     flex-shrink: 0;
     position: relative;
     overflow: hidden;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
}`);
// Remove the @media if it exists
css = css.replace(/@media \(min-width: 768px\) \{[\s\S]*?padding-bottom: 0;\s*\}\s*\}/, '');

// Also ensure wrapper moves correctly by pixels or percentages of the parent
css = css.replace(/#slides-wrapper \{[\s\S]*?\}/, `#slides-wrapper {
     transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
     width: calc(1920px * 10);
}`);

fs.writeFileSync(cssPath, css, 'utf8');

// 3. Update JS to scale presentation-area and translate wrapper by pixels
let js = fs.readFileSync(jsPath, 'utf8');
if (!js.includes('function resizePresentation()')) {
    const resizeLogic = `
function resizePresentation() {
    const area = document.getElementById('presentation-area');
    if(!area) return;
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    area.style.transform = \`translate(-50%, -50%) scale(\${scale})\`;
}
window.addEventListener('resize', resizePresentation);
resizePresentation();
`;
    js = js + resizeLogic;
    
    // Change vw to pixels or percentage for slider wrapper
    js = js.replace(/wrapper\.style\.transform = \`translateX\(-\$\{current \* 100\}vw\)\`;/g, 
        'wrapper.style.transform = `translateX(-${current * 1920}px)`;');
    
    fs.writeFileSync(jsPath, js, 'utf8');
}

console.log("Scaled resolution approach applied.");
