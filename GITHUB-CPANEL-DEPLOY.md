GitHub ile cPanel Otomatik Deploy

Eklenen workflow:
- .github/workflows/deploy-cpanel.yml

Ne yapar:
- main branch'e her push'ta calisir.
- clean-upload/ klasorunu cPanel /public_html/ altina yukler.
- public_html icerigini temizleyip yeni surumu atar (dangerous-clean-slate: true).

GitHub Secrets (zorunlu):
- CPANEL_FTP_HOST
- CPANEL_FTP_USER
- CPANEL_FTP_PASSWORD

Secret ekleme:
1) GitHub repo > Settings > Secrets and variables > Actions
2) New repository secret ile 3 secret'i ekle

cPanel bilgilerinin nereden alinacagi:
- cPanel > FTP Accounts (kullanici/parola)
- cPanel host genelde su formatlardan biri olur:
  - ftp.senin-domainin.com
  - server hostname (hosting firmasinin verdigi)

Ilk calistirma:
1) Bu dosyalari GitHub'a push et.
2) Actions sekmesinden Deploy Static Site to cPanel workflow'unu calistir.
3) Domaini acip kontrol et.

Onemli notlar:
- Bu yontem clean-upload/ klasorunu deploy eder.
- Site kodunda degisiklik varsa once clean-upload'i guncel tut.
- FTP yerine SFTP zorunluysa workflow icinde protocol/port degerlerini degistirebilirim.
