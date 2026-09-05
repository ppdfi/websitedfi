export interface Berita {
  id: number;
  title: string;
  category: string;
  date: string;
  cover: string;
  content: string;
  photo1?: string;
  caption1?: string;
  photo2?: string;
  caption2?: string;
  photo3?: string;
  caption3?: string;
}

export interface Testimoni {
  nama: string;
  waktu: string;
  komentar: string;
}

export interface LembagaItem {
  id: string;
  name: string;
  abbr: string;
  logo: string;
  description: string;
  tag?: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  image: string;
  description: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: 'semua' | 'ibadah' | 'akademik' | 'ekskul' | 'kegiatan';
}

export interface PrestasiItem {
  id: string;
  santri: string;
  peringkat: string;
  lomba: string;
  keterangan: string;
  tanggal: string;
}

// =========================================================================
// DATA UTAMA PESANTREN (EDIT SEMUA INFORMASI, LINK & FOTO DI SINI)
// =========================================================================
export const PESANTREN_INFO = {
  name: "Pondok Pesantren Darul Fawaid Ilmiyah",
  shortName: "PP DFI",
  logoUrl: "https://github.com/ppdfi/aset/blob/main/LogoDFI/Logo%20PNG.png?raw=true",
  heroLogoUrl: "https://github.com/ppdfi/aset/blob/main/LogoDFI/Logo%20PNG.png?raw=true",
  heroBackground: "https://github.com/ppdfi/aset/blob/main/Website/Background.jpg?raw=true",
  tagline: "Bersama kami, Membina Akhlaqul Karimah dan Menjadi Generasi Islamiyah yang Mampu Menggali Potensi & Meraih Segudang Prestasi!",
  registrationFormUrl: "https://forms.gle/SK7MLpni2ge26UC99",
  whatsappUrl: "https://wa.me/6282290505240",
  whatsappPhone: "0822 9050 5240",
  email: "ppdarulfawaidilmiyah@gmail.com",
  yayasanName: "Yayasan Darul Ghiran Alyamany",
  alamat: "Dusun Giran RT 001 RW 002 Desa Randujalak Kecamatan Besuk Kabupaten Probolinggo Jawa Timur || Kode Pos: 67283",
  ruteTransportasi: "Lokasi Pesantren sangat mudah dijangkau menggunakan berbagai moda transportasi. Dari Bakso Pandawa Besuk, cukup menempuh perjalanan sekitar 350 meter ke arah timur.",
  mapsIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1587.2315137685423!2d113.47668002037031!3d-7.773006802391535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd701bb385cc319%3A0x28b2a3c685f6c961!2sYayasan%20Darul%20Ghiran%20Alyamany!5e0!3m2!1sid!2sid!4v1784210131507!5m2!1sid!2sid",
  gasUrl: "https://script.google.com/macros/s/AKfycbyjSje0RaSthdMWS4GlMQMT5rLRMEoB5xGMqvzG4S-4Fe7Kwe3SJ_RAjDGBkkn7S72y/exec",
  socials: {
    facebook: "https://www.facebook.com/ponpes.darul.fawaid.ilmiyah",
    instagram: "https://www.instagram.com/pondok_giran",
    youtube: "https://www.youtube.com/@pesantrendarulfawaidilmiyah",
    tiktok: "https://www.tiktok.com/@darul_fawaid_ilmiyah"
  }
};

export const LEMBAGA_LIST: LembagaItem[] = [
  {
    id: "mdt",
    name: "Madrasah Diniyah Takmiliyah (MDT)",
    abbr: "Telah terdaftar resmi dan memiliki Izin Operasional (IJOP).",
    logo: "https://github.com/ppdfi/aset/blob/main/LogoDFI/Logo%20MADIN%20Takmiliyah.png?raw=true",
    description: "Fokus pada pendalaman keilmuan agama Islam (Tafaqquh Fiddin), bimbingan baca tulis Al-Qur'an, kajian kitab kuning dasar, serta pembentukan akhlakul karimah sebagai fondasi spiritual santri.",
    tag: "Pendidikan Diniyah Salaf"
  },
  {
    id: "smp",
    name: "Sekolah Menengah Pertama (SMP)",
    abbr: "Menginduk ke SMP DWK (Dalam proses pengurusan IJOP).",
    logo: "https://github.com/ppdfi/aset/blob/main/LogoDFI/Logo%20SMP.png?raw=true",
    description: "Menyelenggarakan pendidikan dasar menengah yang mengintegrasikan kurikulum nasional (Kemendikbud) dengan nilai-nilai kepesantrenan untuk membentuk karakter santri yang mandiri, disiplin, dan berprestasi.",
  },
  {
    id: "slta",
    name: "Sekolah Lanjutan Tingkat Atas (SLTA)",
    abbr: "Menginduk ke MA DWK dengan kegiatan belajar yang dikelola mandiri.",
    logo: "https://github.com/ppdfi/aset/blob/main/LogoDFI/StarPlaceHolder.png?raw=true",
    description: "Mempersiapkan kader lulusan yang kompeten, berwawasan luas, dan memiliki kemampuan literasi digital agar siap bersaing di tingkat perguruan tinggi maupun dunia kerja berlandaskan iman dan takwa.",
    tag: "Lanjutan Menengah Atas"
  }
];

export const PROGRAM_LIST: ProgramItem[] = [
  {
    id: "yanbua",
    title: "Baca Tulis Qur'an Metode Yanbu'a",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Progam%20Unggulan/Yanbua.jpg?raw=true",
    description: "Program pembelajaran membaca dan menulis Al-Qur'an secara tartil yang terstruktur, cepat, dan bersanad.",
    category: "Al-Qur'an & Tajwid"
  },
  {
    id: "kitab",
    title: "Kajian Kitab Kuning",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Progam%20Unggulan/Kitab.jpg?raw=true",
    description: "Kajian kitab salaf meliputi ilmu fikih, hadits, aqidah, akhlak, dan tarikh untuk mencetak generasi tafaqquh fiddin.",
    category: "Tafaqquh Fiddin"
  },
  {
    id: "bahasa",
    title: "Kursus Bahasa Asing",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Progam%20Unggulan/Bahasa.jpg?raw=true",
    description: "Pelatihan intensif bahasa Arab dan Inggris untuk membekali santri dengan kemampuan komunikasi global dan literasi internasional.",
    category: "Bahasa Arab & Inggris"
  },
  {
    id: "belajar-wajib",
    title: "Belajar Wajib",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Progam%20Unggulan/BelajarWajib.jpg?raw=true",
    description: "Jam belajar terpadu dan pendampingan kurikulum formal maupun diniyah untuk memastikan pencapaian akademis santri secara maksimal.",
    category: "Bimbingan Belajar"
  },
  {
    id: "wali-asuh",
    title: "Program Wali Asuh",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Progam%20Unggulan/WaliAsuh.jpg?raw=true",
    description: "Pendampingan intensif oleh asatidz sebagai orang tua asuh di pesantren untuk memantau perkembangan karakter, ibadah, dan prestasi santri.",
    category: "Pengasuhan & Karakter"
  }
];

export const GALLERY_LIST: GalleryItem[] = [
  {
    id: "g1",
    title: "KBM Madin",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/KBMMadin.jpg?raw=true",
    category: "akademik"
  },
  {
    id: "g2",
    title: "KBM SMP",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/KBMSMP.jpg?raw=true",
    category: "akademik"
  },
  {
    id: "g3",
    title: "Upacara Bendera",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/Upacara.jpeg?raw=true",
    category: "kegiatan"
  },
  {
    id: "g4",
    title: "Pengajian Kitab",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/PengajianKitab.jpg?raw=true",
    category: "ibadah"
  },
  {
    id: "g5",
    title: "Pembacaan Diba'iyyah",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/Diba.jpeg?raw=true",
    category: "ibadah"
  },
  {
    id: "g6",
    title: "Pendalaman Furudul 'Ainiyah & Kemasyarakatan",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/FA.jpg?raw=true",
    category: "ibadah"
  },
  {
    id: "g7",
    title: "Wejangan Pengasuh",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/WejanganPengasuh.jpeg?raw=true",
    category: "kegiatan"
  },
  {
    id: "g8",
    title: "Istighatsah & Rapat Bulanan Pengajar Yayasan",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/Rapat.jpg?raw=true",
    category: "kegiatan"
  },
  {
    id: "g9",
    title: "Ekstrakurikuler Pagar Nusa",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/Rapat.jpg?raw=true",
    category: "ekskul"
  },
  {
    id: "g10",
    title: "Ekstrakurikuler Melukis",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/EkstraMelukis.jpg?raw=true",
    category: "ekskul"
  },
  {
    id: "g11",
    title: "Ekstrakurikuler Futsal",
    image: "https://github.com/ppdfi/aset/blob/main/Website/Galeri/EkstraFutsal.jpeg?raw=true",
    category: "ekskul"
  }
];

export const PRESTASI_LIST: PrestasiItem[] = [
  {
    id: "p1",
    santri: "Lomba Tartilul Qur'an",
    peringkat: "Juara 1",
    lomba: "Ananda Ana Maulidiah",
    keterangan: "Pada Festival Satu Muharram (Tahun Baru Islam 1448 H) yang diselenggarakan oleh Masjid Baitur Rahim Randujalak Besuk pada 13 Juni 2026.",
    tanggal: "13 Juni 2026"
  },
  {
    id: "p2",
    santri: "Lomba Tartilul Qur'an",
    peringkat: "Juara 3",
    lomba: "Ananda Moh. Hifdi Akmalul Iman",
    keterangan: "Pada Festival Satu Muharram (Tahun Baru Islam 1448 H) yang diselenggarakan oleh Masjid Baitur Rahim Randujalak Besuk pada 13 Juni 2026.",
    tanggal: "13 Juni 2026"
  },
  {
    id: "p3",
    santri: "Lomba Tartilul Qur'an",
    peringkat: "Juara Harapan Satu",
    lomba: "Ananda Yuliana",
    keterangan: "Pada Festival Satu Muharram (Tahun Baru Islam 1448 H) yang diselenggarakan oleh Masjid Baitur Rahim Randujalak Besuk pada 13 Juni 2026.",
    tanggal: "13 Juni 2026"
  }
];

export const INITIAL_BERITA: Berita[] = [
  {
    id: 101,
    title: "Penerimaan Santri Baru (PSB) Tahun Ajaran 2027/2028 Segera Dibuka",
    category: "Pengumuman",
    date: "2026-08-15T00:00:00.000Z",
    cover: "https://github.com/ppdfi/aset/blob/main/Website/Background.jpg?raw=true",
    content: "Pondok Pesantren Darul Fawaid Ilmiyah secara resmi membuka pendaftaran santri baru untuk tahun ajaran mendatang. Tersedia berbagai macam program dan fasilitas asrama representatif untuk menunjang tumbuh kembang santri."
  }
];
