# 🍼 Nurbaby - Aplikasi Parenting

Aplikasi web untuk membantu orang tua dalam memantau dan mengelola informasi anak-anak mereka dengan mudah.

## 🚀 Fitur

- ✅ Autentikasi dengan email & password
- ✅ Dashboard personal untuk setiap orang tua
- ✅ Manajemen data anak-anak
- ✅ Integrasi dengan Supabase
- 🔄 Fitur tambahan akan segera hadir

## 🛠️ Setup

### 1. Clone Repository
```bash
git clone https://github.com/seaclaw-arch/nurbaby.git
cd nurbaby
```

### 2. Konfigurasi Supabase

#### Opsi A: Menggunakan Konfigurasi yang Sudah Ada
Untuk development, konfigurasi Supabase sudah di-hardcode di `app.js`.

#### Opsi B: Menggunakan Environment Variables (Recommended)

1. Buat file `.env` di root project:
```bash
cp .env.example .env
```

2. Edit `.env` dan masukkan kredensial Supabase Anda:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Setup Database Supabase

Pastikan Anda sudah membuat tabel berikut di Supabase:

#### Tabel: `children`
```sql
create table children (
  id uuid default gen_random_uuid() primary key,
  parent_id uuid not null references auth.users(id) on delete cascade,
  name varchar(100) not null,
  age integer,
  birth_date date,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table children enable row level security;

create policy "Users can view their own children" on children
  for select using (parent_id = auth.uid());

create policy "Users can insert their own children" on children
  for insert with check (parent_id = auth.uid());
```

### 4. Jalankan Aplikasi

#### Menggunakan Live Server (VS Code)
1. Install extension "Live Server"
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"

#### Menggunakan Python
```bash
python -m http.server 8000
```
Kemudian buka `http://localhost:8000`

#### Menggunakan Node.js
```bash
npx http-server
```

## 📋 Struktur Project

```
nurbaby/
├── index.html      # File HTML utama
├── style.css       # Styling aplikasi
├── app.js          # Logika aplikasi & Supabase integration
├── .env.example    # Template environment variables
├── README.md       # Dokumentasi
└── .gitignore      # File yang diabaikan git
```

## 🔐 Keamanan

- **Anon Key**: Aman untuk di-publish (hanya baca data sesuai RLS policy)
- **Service Role Key**: JANGAN share! Hanya untuk backend
- Selalu gunakan **Row Level Security (RLS)** untuk melindungi data user
- Jangan commit `.env` file (gunakan `.env.example` sebagai template)

## 📱 Penggunaan

1. **Sign Up**: Daftar dengan email dan password
2. **Login**: Masuk dengan email dan password Anda
3. **Dashboard**: Lihat data anak-anak Anda
4. **Tambah Anak**: Tambahkan data anak baru (fitur dalam pengembangan)

## 🤝 Kontribusi

Kontribusi sangat diterima! Silahkan:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini open source dan tersedia untuk penggunaan bebas.

## 👨‍💻 Author

**seaclaw-arch** - Pemula dalam development

## 📞 Dukungan

Jika ada pertanyaan atau masalah, silahkan buka Issue di GitHub.

---

**Dibuat dengan ❤️ untuk para orang tua Indonesia**