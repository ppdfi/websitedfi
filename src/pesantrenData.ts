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
  logoUrl: "https://i.ibb.co.com/LX68brCv/Logo-PNG.png",
  heroLogoUrl: "https://i.ibb.co.com/LX68brCv/Logo-PNG.png",
  heroBackground: "https://i.ibb.co.com/zzqMMFq/DSC5150.jpg",
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
    logo: "https://i.ibb.co.com/BHBvLX08/Logo-MADIN-Takmiliyah.png",
    description: "Fokus pada pendalaman keilmuan agama Islam (Tafaqquh Fiddin), bimbingan baca tulis Al-Qur'an, kajian kitab kuning dasar, serta pembentukan akhlakul karimah sebagai fondasi spiritual santri.",
    tag: "Pendidikan Diniyah Salaf"
  },
  {
    id: "smp",
    name: "Sekolah Menengah Pertama (SMP)",
    abbr: "Menginduk ke SMP DWK (Dalam proses pengurusan IJOP).",
    logo: "https://i.ibb.co.com/TDzHjMjZ/Logo-SMP.png",
    description: "Menyelenggarakan pendidikan dasar menengah yang mengintegrasikan kurikulum nasional (Kemendikbud) dengan nilai-nilai kepesantrenan untuk membentuk karakter santri yang mandiri, disiplin, dan berprestasi.",
  },
  {
    id: "slta",
    name: "Sekolah Lanjutan Tingkat Atas (SLTA)",
    abbr: "Menginduk ke MA DWK dengan kegiatan belajar yang dikelola mandiri.",
    logo: "https://i.ibb.co.com/F9HrznH/Excel.png",
    description: "Mempersiapkan kader lulusan yang kompeten, berwawasan luas, dan memiliki kemampuan literasi digital agar siap bersaing di tingkat perguruan tinggi maupun dunia kerja berlandaskan iman dan takwa.",
    tag: "Lanjutan Menengah Atas"
  }
];

export const PROGRAM_LIST: ProgramItem[] = [
  {
    id: "yanbua",
    title: "Baca Tulis Qur'an Metode Yanbu'a",
    image: "https://i.ibb.co.com/bwVCKdz/Yanbu-a.jpg",
    description: "Program pembelajaran membaca dan menulis Al-Qur'an secara tartil yang terstruktur, cepat, dan bersanad.",
    category: "Al-Qur'an & Tajwid"
  },
  {
    id: "kitab",
    title: "Kajian Kitab Kuning",
    image: "https://i.ibb.co.com/dsN1V1DN/Kitab.jpg",
    description: "Kajian kitab salaf meliputi ilmu fikih, hadits, aqidah, akhlak, dan tarikh untuk mencetak generasi tafaqquh fiddin.",
    category: "Tafaqquh Fiddin"
  },
  {
    id: "bahasa",
    title: "Kursus Bahasa Asing",
    image: "https://i.ibb.co.com/Ng2X2bTw/Bahasa.jpg",
    description: "Pelatihan intensif bahasa Arab dan Inggris untuk membekali santri dengan kemampuan komunikasi global dan literasi internasional.",
    category: "Bahasa Arab & Inggris"
  },
  {
    id: "belajar-wajib",
    title: "Belajar Wajib",
    image: "https://i.ibb.co.com/MxQdNc7v/Beajar-Wajib.jpg",
    description: "Jam belajar terpadu dan pendampingan kurikulum formal maupun diniyah untuk memastikan pencapaian akademis santri secara maksimal.",
    category: "Bimbingan Belajar"
  },
  {
    id: "wali-asuh",
    title: "Program Wali Asuh",
    image: "https://i.ibb.co.com/GvzCyVXn/Wali-Asuh.jpg",
    description: "Pendampingan intensif oleh asatidz sebagai orang tua asuh di pesantren untuk memantau perkembangan karakter, ibadah, dan prestasi santri.",
    category: "Pengasuhan & Karakter"
  }
];

export const GALLERY_LIST: GalleryItem[] = [
  {
    id: "g1",
    title: "KBM Madin",
    image: "https://i.ibb.co.com/Q3ZccjYY/KBM-Madin.jpg",
    category: "akademik"
  },
  {
    id: "g2",
    title: "KBM SMP",
    image: "https://i.ibb.co.com/gbFGdhwr/KBM-SMP.jpg",
    category: "akademik"
  },
  {
    id: "g3",
    title: "Upacara Bendera",
    image: "https://i.ibb.co.com/60Y0gP5c/Upacara.jpg",
    category: "kegiatan"
  },
  {
    id: "g4",
    title: "Pengajian Kitab",
    image: "https://i.ibb.co.com/cKqTkX5R/Pengajian-Kitab.jpg",
    category: "ibadah"
  },
  {
    id: "g5",
    title: "Pembacaan Diba'iyyah",
    image: "https://i.ibb.co.com/NgY1kfW2/Diba.jpg",
    category: "ibadah"
  },
  {
    id: "g6",
    title: "Pendalaman Furudul 'Ainiyah & Kemasyarakatan",
    image: "https://i.ibb.co.com/4Z6qRT4L/FA.jpg",
    category: "ibadah"
  },
  {
    id: "g7",
    title: "Wejangan Pengasuh",
    image: "https://i.ibb.co.com/BHrfc5p7/Wejangan-Pengasuh.jpg",
    category: "kegiatan"
  },
  {
    id: "g8",
    title: "Istighatsah & Rapat Bulanan Pengajar Yayasan",
    image: "https://i.ibb.co.com/W4fWVNR2/Rapat.jpg",
    category: "kegiatan"
  },
  {
    id: "g9",
    title: "Ekstrakurikuler Pagar Nusa",
    image: "https://i.ibb.co.com/whkc251Y/Ekstra-Pagar-Nusa.jpg",
    category: "ekskul"
  },
  {
    id: "g10",
    title: "Ekstrakurikuler Melukis",
    image: "https://i.ibb.co.com/JwTP2wXr/Melukis.jpg",
    category: "ekskul"
  },
  {
    id: "g11",
    title: "Ekstrakurikuler Futsal",
    image: "https://i.ibb.co.com/xS6rs6Tn/Futsal.jpg",
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
    title: "Penerimaan Santri Baru (PSB) Tahun Ajaran 2027/2028 Resmi Dibuka",
    category: "Pengumuman",
    date: "2026-08-15T00:00:00.000Z",
    cover: "https://i.ibb.co.com/zzqMMFq/DSC5150.jpg",
    content: "Pondok Pesantren Darul Fawaid Ilmiyah secara resmi membuka pendaftaran santri baru untuk tahun ajaran mendatang. Tersedia program beasiswa tahfidz dan fasilitas asrama representatif untuk menunjang tumbuh kembang santri."
  }
];
