const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace presentation-area wrapper
html = html.replace(
  /<div id="presentation-area"[\s\S]*?style="width: 1920px; height: 1080px; transform: translate\(-50%, -50%\) scale\(1\);.*?>/g,
  '<div id="presentation-area" class="relative w-full h-screen overflow-hidden">'
);

// Replace logos block in all slides
const oldLogosRegex = /<div class="absolute top-8 left-8 z-50">[\s\S]*?<img src="\.\/images\/leaders-league\.png" class="h-12 w-auto object-contain" alt="Leaders League">[\s\S]*?<\/div>[\s\S]*?<div class="absolute top-8 right-8 z-50">[\s\S]*?<img src="\.\/images\/ylf\.png" class="h-12 w-auto object-contain" alt="YLF">[\s\S]*?<\/div>[\s\S]*?<div class="absolute top-6 left-1\/2 -translate-x-1\/2 z-50">[\s\S]*?<img src="\.\/images\/assiut-robotics\.png" class="h-16 w-auto object-contain" alt="Assiut Robotics">[\s\S]*?<\/div>/g;

const newLogos = `<div class="absolute top-4 w-full px-6 flex justify-between items-center z-50">
          <img src="./images/leaders-league.png" class="h-6 md:h-12 w-auto object-contain" alt="Leaders League">
          <img src="./images/assiut-robotics.png" class="h-8 md:h-16 w-auto object-contain" alt="Assiut Robotics">
          <img src="./images/ylf.png" class="h-6 md:h-12 w-auto object-contain" alt="YLF">
        </div>`;

html = html.replace(oldLogosRegex, newLogos);

// Add max-w-full to SVG in slide 1
html = html.replace('class="w-[260px] md:w-[380px] lg:w-[480px] overflow-visible"', 'class="w-[260px] md:w-[380px] lg:w-[480px] max-w-full overflow-visible"');

fs.writeFileSync('index.html', html);
console.log("Updated index.html");

// 2. Update styles.css
let css = fs.readFileSync('styles.css', 'utf8');

css = css.replace(/#slides-wrapper\s*\{[\s\S]*?width:\s*calc\(1920px \* 10\);[\s\S]*?\}/, `#slides-wrapper {
     transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
     width: 1000%;
     height: 100%;
     display: flex;
}`);

css = css.replace(/\.slide\s*\{[\s\S]*?width:\s*1920px;[\s\S]*?height:\s*1080px;[\s\S]*?flex-shrink:\s*0;[\s\S]*?position:\s*relative;[\s\S]*?overflow:\s*hidden;[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column;[\s\S]*?align-items:\s*center;[\s\S]*?justify-content:\s*center;[\s\S]*?\}/, `.slide {
     width: 10%;
     height: 100vh;
     flex-shrink: 0;
     position: relative;
     overflow-y: auto;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     padding: 2rem;
}`);

fs.writeFileSync('styles.css', css);
console.log("Updated styles.css");

// 3. Update script.js
let script = fs.readFileSync('script.js', 'utf8');

script = script.replace(/function goSlide\(n\) \{[\s\S]*?wrapper\.style\.transform = `translateX\(-?\$\{current \* 1920\}px\)`;[\s\S]*?\}\n/, `function goSlide(n) {
     if (n < 0 || n >= total) return;
     slides[current].classList.remove('active');
     current = n;
     slides[current].classList.add('active');
     wrapper.style.transform = \`translateX(-\${current * (100 / total)}%)\`;
     progressBar.style.width = \`\${((current + 1) / total) * 100}%\`;
     slideNum.textContent = String(current + 1).padStart(2, '0');
     prevBtn.style.opacity = current === 0 ? '0' : '1';
     prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';
     nextBtn.style.opacity = current === total - 1 ? '0' : '1';
     nextBtn.style.pointerEvents = current === total - 1 ? 'none' : 'auto';
}
`);

// Remove resizePresentation
script = script.replace(/function resizePresentation\(\) \{[\s\S]*?window\.addEventListener\('resize', resizePresentation\);\nresizePresentation\(\);\n/, '');

fs.writeFileSync('script.js', script);
console.log("Updated script.js");
