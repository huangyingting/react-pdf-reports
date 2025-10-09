import * as fs from 'fs';
import * as path from 'path';

interface CSSClassInfo {
  className: string;
  file: string;
  used: boolean;
}

interface FileAnalysis {
  file: string;
  definedClasses: string[];
  unusedClasses: string[];
}

// Find all files with a given extension recursively
function findFiles(dir: string, extension: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (!file.includes('node_modules') && !file.includes('build')) {
        findFiles(filePath, extension, fileList);
      }
    } else if (file.endsWith(extension)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract CSS class names from CSS files
function extractCSSClasses(cssContent: string): string[] {
  const classNames: string[] = [];
  
  // Match class selectors (.)
  const classRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;
  let match;
  
  while ((match = classRegex.exec(cssContent)) !== null) {
    const className = match[1];
    if (!classNames.includes(className)) {
      classNames.push(className);
    }
  }
  
  return classNames;
}

// Extract className usage from TSX/JS files
function extractClassNameUsage(tsxContent: string): string[] {
  const classNames: string[] = [];
  
  // Match className="..." or className='...' or className={`...`}
  const patterns = [
    /className=["']([^"']+)["']/g,
    /className=\{`([^`]+)`\}/g,
    /className=\{["']([^"']+)["']\}/g,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(tsxContent)) !== null) {
      const classes = match[1].split(/\s+/).filter(c => c && !c.includes('${'));
      classes.forEach(className => {
        if (!classNames.includes(className) && className.trim()) {
          classNames.push(className.trim());
        }
      });
    }
  });
  
  // Also check for dynamic class construction
  const dynamicClassRegex = /['"]([\w-]+)['"]/g;
  const lines = tsxContent.split('\n');
  lines.forEach(line => {
    if (line.includes('className') && (line.includes('$') || line.includes('+'))) {
      let match;
      while ((match = dynamicClassRegex.exec(line)) !== null) {
        const className = match[1];
        if (!classNames.includes(className) && /^[a-zA-Z_-]/.test(className)) {
          classNames.push(className);
        }
      }
    }
  });
  
  return classNames;
}

function main() {
  const srcDir = path.join(__dirname, 'src');
  
  console.log('🔍 Finding CSS and TSX files...\n');
  
  // Find all CSS and TSX files
  const cssFiles = findFiles(srcDir, '.css');
  const tsxFiles = findFiles(srcDir, '.tsx');
  const jsFiles = findFiles(srcDir, '.js');
  
  console.log(`Found ${cssFiles.length} CSS files`);
  console.log(`Found ${tsxFiles.length} TSX files`);
  console.log(`Found ${jsFiles.length} JS files\n`);
  
  // Extract all defined CSS classes
  const definedClasses: Map<string, CSSClassInfo[]> = new Map();
  
  cssFiles.forEach(cssFile => {
    const content = fs.readFileSync(cssFile, 'utf-8');
    const classes = extractCSSClasses(content);
    
    classes.forEach(className => {
      if (!definedClasses.has(className)) {
        definedClasses.set(className, []);
      }
      definedClasses.get(className)!.push({
        className,
        file: cssFile.replace(srcDir, 'src'),
        used: false
      });
    });
  });
  
  console.log(`📝 Found ${definedClasses.size} unique CSS classes defined\n`);
  
  // Extract all used classes from TSX/JS files
  const usedClasses = new Set<string>();
  
  [...tsxFiles, ...jsFiles].forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const classes = extractClassNameUsage(content);
    classes.forEach(className => usedClasses.add(className));
  });
  
  console.log(`✅ Found ${usedClasses.size} unique CSS classes used\n`);
  
  // Mark used classes
  usedClasses.forEach(className => {
    if (definedClasses.has(className)) {
      definedClasses.get(className)!.forEach(info => {
        info.used = true;
      });
    }
  });
  
  // Find unused classes
  const unusedByFile: Map<string, string[]> = new Map();
  
  definedClasses.forEach((infos, className) => {
    infos.forEach(info => {
      if (!info.used) {
        if (!unusedByFile.has(info.file)) {
          unusedByFile.set(info.file, []);
        }
        unusedByFile.get(info.file)!.push(className);
      }
    });
  });
  
  // Print results
  console.log('=' .repeat(80));
  console.log('UNUSED CSS CLASSES BY FILE');
  console.log('='.repeat(80));
  console.log();
  
  if (unusedByFile.size === 0) {
    console.log('✨ No unused CSS classes found!');
  } else {
    let totalUnused = 0;
    
    Array.from(unusedByFile.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([file, classes]) => {
        const uniqueClasses = [...new Set(classes)].sort();
        totalUnused += uniqueClasses.length;
        
        console.log(`\n📄 ${file}`);
        console.log(`   ${uniqueClasses.length} unused classes:`);
        uniqueClasses.forEach(className => {
          console.log(`   - .${className}`);
        });
      });
    
    console.log('\n' + '='.repeat(80));
    console.log(`🗑️  TOTAL: ${totalUnused} unused CSS classes found in ${unusedByFile.size} files`);
    console.log('='.repeat(80));
  }
  
  // Save report to file
  const reportPath = path.join(__dirname, 'unused-css-report.txt');
  let report = 'UNUSED CSS CLASSES REPORT\n';
  report += '='.repeat(80) + '\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  if (unusedByFile.size === 0) {
    report += 'No unused CSS classes found!\n';
  } else {
    Array.from(unusedByFile.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([file, classes]) => {
        const uniqueClasses = [...new Set(classes)].sort();
        report += `\nFile: ${file}\n`;
        report += `Unused classes (${uniqueClasses.length}):\n`;
        uniqueClasses.forEach(className => {
          report += `  - .${className}\n`;
        });
      });
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📋 Report saved to: unused-css-report.txt`);
}

main();
