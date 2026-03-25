/**
 * Statik export (out/) -> clean-upload/ kopyalar + FileZilla notu ekler.
 * Calistir: npm run prepare:upload
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");
const destDir = path.join(root, "clean-upload");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Bulunamadi: ${src} — once "npm run build" calissin mi kontrol edin.`);
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function clearDirectoryContents(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);

    try {
      fs.rmSync(target, { recursive: true, force: true });
    } catch {
      console.warn(`>>> Uyari: silinemedi, ustune yazilacak -> ${target}`);
    }
  }
}

console.log(">>> npm run build");
execSync("npm run build", { cwd: root, stdio: "inherit" });

console.log(">>> clean-upload klasorunu yenile");
clearDirectoryContents(destDir);
copyRecursive(outDir, destDir);

const filezillaTxt = `FILEZILLA ILE TEMIZ YUKLEME (34kurye statik site)
================================================

Bu klasor (clean-upload) icindekilerin TAMAMINI sunucuya yukleyeceksiniz.

1) FileZilla ile baglanin (SFTP tercih: port 22, veya FTP 21).

2) UZAK KLASOR (cPanel):
   /public_html
   (Bazi hesaplarda ana domain dogrudan public_html'e bakar.)

3) ONEMLI:
   - clean-upload KLASORUNUN KENDISINI DEGIL, icindekileri yukleyin.
   - public_html icinde su dosyalar gorunmeli:
     - index.html  (kokte)
     - _next/      (klasor)
     - galeri/     (klasor)
     - robots.txt, sitemap.xml vb.

4) "defaultwebpage.cgi" / "Uzgunum" sayfasi goruyorsaniz:
   - Dosyalar yanlis yerde (or. sadece alt klasore) veya
   - public_html bos / eski cache
   Cozum: public_html icini temizleyip bu klasordeki dosyalari tekrar yukleyin.

5) Galeri resimleri: /gallery/ altinda yerel dosyalar (sunucu dis link engellemez).

6) SSL: cPanel > SSL/TLS Status > AutoSSL (opsiyonel).

Olusturma: npm run prepare:upload
`;

fs.writeFileSync(path.join(destDir, "FILEZILLA-YUKLEME.txt"), filezillaTxt, "utf8");

console.log(">>> Tamam:", destDir);
console.log(">>> FileZilla ile yukleyin: clean-upload ICINDEKILER -> public_html");
