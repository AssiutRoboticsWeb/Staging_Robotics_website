const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Refactor logos
// Current: <div class="absolute top-4 w-full px-6 flex justify-between items-center z-50">...</div>
const logosRegex = /<div class="absolute top-4 w-full px-6 flex justify-between items-center z-50">[\s\S]*?<img src="\.\/images\/leaders-league\.png" class="h-6 md:h-12 w-auto object-contain" alt="Leaders League">[\s\S]*?<img src="\.\/images\/assiut-robotics\.png" class="h-8 md:h-16 w-auto object-contain" alt="Assiut Robotics">[\s\S]*?<img src="\.\/images\/ylf\.png" class="h-6 md:h-12 w-auto object-contain" alt="YLF">[\s\S]*?<\/div>/g;
const newLogos = `<div class="w-full px-4 md:px-8 py-4 flex justify-between items-center z-50 shrink-0">
          <img src="./images/leaders-league.png" class="h-4 md:h-8 w-auto object-contain" alt="Leaders League">
          <img src="./images/assiut-robotics.png" class="h-6 md:h-10 w-auto object-contain" alt="Assiut Robotics">
          <img src="./images/ylf.png" class="h-4 md:h-8 w-auto object-contain" alt="YLF">
        </div>`;
html = html.replace(logosRegex, newLogos);

// 2. Remove inline padding and add flex-1 container classes properly
// Example: <div class="flex flex-col items-center justify-center flex-1 px-6 max-w-5xl mx-auto" style="padding-top:60px">
html = html.replace(/<div class="flex flex-col items-center justify-center flex-1 px-6 max-w-5xl mx-auto" style="padding-top:60px">/g, '<div class="flex flex-col items-center justify-center flex-1 px-6 w-full max-w-5xl mx-auto py-8">');
// Slide 1 has: <div class="flex flex-col items-center justify-center flex-1 px-6" style="margin-top:-30px;margin-bottom:40px">
html = html.replace(/<div class="flex flex-col items-center justify-center flex-1 px-6" style="margin-top:-30px;margin-bottom:40px">/g, '<div class="flex flex-col items-center justify-center flex-1 px-6 w-full py-8">');
// Slide 10 has: <div class="flex flex-col items-center justify-center flex-1 px-6 max-w-4xl mx-auto" style="margin-bottom:60px">
html = html.replace(/<div class="flex flex-col items-center justify-center flex-1 px-6 max-w-4xl mx-auto" style="margin-bottom:60px">/g, '<div class="flex flex-col items-center justify-center flex-1 px-6 w-full max-w-4xl mx-auto py-8">');

// 3. Refactor footers (Learn How to Learn)
// Example: <div class="sc absolute bottom-5 left-0 right-0 text-center" style="--d:.8s">
html = html.replace(/<div class="sc absolute bottom-5 left-0 right-0 text-center" style="(--d:\.[0-9]+s)">/g, '<div class="sc w-full text-center pb-4 shrink-0 z-50" style="$1">');
html = html.replace(/<div class="sc absolute bottom-5 left-0 right-0 text-center" style="--d:\.75s">/g, '<div class="sc w-full text-center pb-4 shrink-0 z-50" style="--d:.75s">'); // exact matches just in case
html = html.replace(/<div class="sc absolute bottom-[0-9]+ left-0 right-0 text-center" style="(--d:\.[0-9]+s)">/g, '<div class="sc w-full text-center pb-4 shrink-0 z-50" style="$1">');

// Slide 1 footer
html = html.replace(/<div class="sc absolute bottom-10 left-0 right-0 flex flex-col items-center" style="(--d:\.8s)">/g, '<div class="sc w-full flex flex-col items-center pb-4 shrink-0 z-50" style="$1">');

// Slide 10 footer (team + text)
html = html.replace(/<div class="sc absolute bottom-12 left-0 right-0 px-6" style="(--d:\.55s)">/g, '<div class="sc w-full px-6 shrink-0 z-50 pb-4" style="$1">');

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');

// Let's also remove padding from .slide in styles.css to rely purely on the flex padding
let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(/padding:\s*2rem;/, '/* padding handled by flex children */');
fs.writeFileSync('styles.css', css);
console.log('styles.css updated successfully.');
