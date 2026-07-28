const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Make top logos responsive to avoid overlapping on small screens
const oldLogos = `      <div class="absolute top-8 left-8 z-50">
        <img src="./images/leaders-league.png" class="h-12 w-auto object-contain" alt="Leaders League">
      </div>
      <div class="absolute top-8 right-8 z-50">
        <img src="./images/ylf.png" class="h-12 w-auto object-contain" alt="YLF">
      </div>
      <div class="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <img src="./images/assiut-robotics.png" class="h-16 w-auto object-contain" alt="Assiut Robotics">
      </div>`;

const newLogos = `      <div class="absolute top-4 left-4 md:top-8 md:left-8 z-50">
        <img src="./images/leaders-league.png" class="h-6 md:h-12 w-auto object-contain" alt="Leaders League">
      </div>
      <div class="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <img src="./images/ylf.png" class="h-6 md:h-12 w-auto object-contain" alt="YLF">
      </div>
      <div class="absolute top-3 md:top-6 left-1/2 -translate-x-1/2 z-50">
        <img src="./images/assiut-robotics.png" class="h-8 md:h-16 w-auto object-contain" alt="Assiut Robotics">
      </div>`;

content = content.split(oldLogos).join(newLogos);

// Fix 2: Adjust the inline padding-top which crashes into logos on mobile
content = content.replace(/style="padding-top:60px"/g, 'class="pt-24 md:pt-[60px] pb-10 md:pb-0"');

// Fix 3: Ensure the flex containers have w-full
content = content.replace(/class="flex flex-col items-center justify-center flex-1 px-6 max-w-5xl mx-auto"/g, 'class="flex flex-col items-center md:justify-center flex-1 px-4 md:px-6 w-full max-w-5xl mx-auto pt-24 md:pt-[60px] pb-10 md:pb-0"');

// Remove the inline padding from the ones that were just replaced above to avoid duplication
content = content.replace(/class="flex flex-col items-center md:justify-center flex-1 px-4 md:px-6 w-full max-w-5xl mx-auto pt-24 md:pt-\[60px\] pb-10 md:pb-0" style="padding-top:60px"/g, 'class="flex flex-col items-center md:justify-center flex-1 px-4 md:px-6 w-full max-w-5xl mx-auto pt-24 md:pt-[60px] pb-10 md:pb-0"');

// Fix 4: Slide 1 has a special margin
content = content.replace(/style="margin-top:-30px;margin-bottom:40px"/g, 'class="mt-12 md:-mt-8 mb-10 w-full"');

// Fix 5: The "Learn How to Learn" text overlaps with progress bar on mobile
content = content.replace(/class="sc absolute bottom-5 left-0 right-0 text-center"/g, 'class="sc absolute bottom-8 md:bottom-5 left-0 right-0 text-center"');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Responsiveness fixes applied to index.html");
