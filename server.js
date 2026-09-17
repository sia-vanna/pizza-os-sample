const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/', (req,res)=>res.send(`
<html><head><title>pizza-os</title>
<style>body{background:#0a0a0a;color:#ccc;font-family:monospace;padding:20px}button{background:#ff6a00;border:0;padding:10px 18px;margin:4px;border-radius:6px;font-weight:bold;cursor:pointer}#log{background:#000;padding:12px;white-space:pre-wrap;border:1px solid #222;height:500px;overflow:auto}</style>
</head><body>
<h1>🍕 pizza-os — booter works!</h1>
<button onclick="go('build')">Build</button>
<button onclick="go('check')">Check Header + NOTE</button>
<button onclick="go('qemu')">Boot QEMU (5s test)</button>
<pre id=log>ready... if you see SeaBIOS = PVH fix worked ✅</pre>
<script>
async function go(c){log.textContent='> '+c+' running...\\n'; let r=await fetch('/api/'+c,{method:'POST'}).then(r=>r.text()); log.textContent=r}
const log=document.getElementById('log');
</script>
</body></html>`));

function run(cmd,res){ exec(cmd, {cwd:__dirname, timeout:15000}, (e,o,er)=>res.send((o||'')+(er||''))); }
app.post('/api/build',(req,res)=>run('nasm -f elf32 boot.asm -o boot.o && g++ -m32 -ffreestanding -O2 -c kernel.cpp -o kernel.o && ld -m elf_i386 -T linker.ld -o pizza-os.bin boot.o kernel.o -nostdlib && echo "✅ built" && ls -lh pizza-os.bin',res));
app.post('/api/check',(req,res)=>run('grub-file --is-x86-multiboot2 pizza-os.bin && echo "✅ VALID multiboot2" || echo "❌ INVALID"; echo ""; readelf -l pizza-os.bin | grep -A1 NOTE; echo ""; readelf -n pizza-os.bin',res));
app.post('/api/qemu',(req,res)=>run('echo "Booting... will timeout after 5s (that means it booted and is in hlt loop)"; timeout 5 qemu-system-i386 -kernel pizza-os.bin -nographic 2>&1; echo "\\n---\\nIf you saw SeaBIOS and no PVH error, boot succeeded ✅"',res));

app.listen(3000,()=>console.log('🍕 http://localhost:3000'));
