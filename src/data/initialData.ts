import { Product, ShippingZone, CompanySettings, Order, TestimonialItem } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_quarry_truck_1794022009570.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_pasir_01',
    name: 'Pasir Bangunan & Pengecoran',
    category: 'pasir',
    shortDescription: 'Pasir sungai alami mutu tinggi dari Wangar Makmur Nabire Barat, bersih lumpur & berbutir tajam.',
    fullDescription: 'Pasir pilihan kualitas premium yang ditambang langsung di Kampung Wangar Makmur, Distrik Nabire Barat. Memiliki kadar lumpur sangat rendah (<3%), butiran kasar-sedang yang tajam dan padat. Sangat direkomendasikan untuk pengecoran struktur beton bertulang (tiang, sloof, balok, dak), plesteran dinding halus, dan adukan pasangan bata.',
    useCases: [
      'Pasir untuk bangunan dan gedung bertingkat',
      'Pasir untuk pengecoran beton struktural & jalan semen',
      'Pasir untuk kebutuhan konstruksi umum & batako'
    ],
    pricePerRit: 1250000,
    available: true,
    stockRitEstimated: 250,
    imageUrl: '/src/assets/images/product_pasir_1794022010015.jpg',
    unit: 'Rit Dump Truck (± 4-5 m³)',
    specs: {
      origin: 'Quarry Wangar Makmur, Nabire Barat',
      grainSize: '0.15 - 4.75 mm (Gradasi Kasar Sedang)',
      color: 'Abu-abu kehitaman alami',
      density: '± 1.45 - 1.55 ton/m³'
    }
  },
  {
    id: 'prod_batu_02',
    name: 'Batu Belah & Batu Pecah Fondasi',
    category: 'batu',
    shortDescription: 'Batu kali belah & split keras alami untuk fondasi kokoh, jembatan, talud & retaining wall.',
    fullDescription: 'Batu andesit & kali keras asli Nabire dengan kekuatan tekan sangat tinggi. Tidak mudah rapuh, tahan cuaca ekstrem dan air tanah asam. Sangat cocok untuk fondasi lajur bangunan bertingkat, bronjong kawat, talud penahan tebing, dinding penahan tanah lereng, dan agregat beton tahan gempa.',
    useCases: [
      'Batu pecah untuk agregat konstruksi',
      'Batu untuk fondasi bangunan, ruko & jembatan',
      'Batu untuk konstruksi dinding penahan tebing & talud'
    ],
    pricePerRit: 1450000,
    available: true,
    stockRitEstimated: 180,
    imageUrl: '/src/assets/images/product_batu_1794022009634.jpg',
    unit: 'Rit Dump Truck (± 4-5 m³)',
    specs: {
      origin: 'Quarry Wangar Makmur, Nabire Barat',
      grainSize: '15 - 30 cm (Batu Belah) / 1-2 cm, 2-3 cm (Split)',
      color: 'Abu-abu gelap basalt padat',
      density: '± 1.6 - 1.7 ton/m³'
    }
  },
  {
    id: 'prod_sirtu_03',
    name: 'Sirtu (Pasir Batu Pengerasan)',
    category: 'sirtu',
    shortDescription: 'Campuran alami pasir kerikil bergradasi padat untuk perkerasan jalan akses & lapis pondasi.',
    fullDescription: 'Material Pasir Batu (Sirtu) alam dengan proporsi seimbang antara butiran kerikil bundar/tajam dan pasir pengikat. Menghasilkan pemadatan maksimal saat digilas roller. Ideal untuk perkerasan jalan logistik perkebunan, jalan perumahan baru, subbase pondasi jalan aspal, dan material urugan tebal.',
    useCases: [
      'Pasir batu (sirtu) alam bergradasi baik',
      'Material untuk pengerasan jalan proyek & perkebunan',
      'Material untuk urugan padat dasar lantai & lapangan'
    ],
    pricePerRit: 950000,
    available: true,
    stockRitEstimated: 320,
    imageUrl: '/src/assets/images/product_sirtu_1794022011101.jpg',
    unit: 'Rit Dump Truck (± 4-5 m³)',
    specs: {
      origin: 'Deposit Aluvial Wangar Makmur, Nabire',
      grainSize: '0 - 50 mm (Gradasi Kontinu)',
      color: 'Cokelat abu-abu alami',
      density: '± 1.75 - 1.9 ton/m³ (terpadatkan)'
    }
  },
  {
    id: 'prod_tanah_04',
    name: 'Tanah Timbunan & Pemerataan Lahan',
    category: 'tanah_timbunan',
    shortDescription: 'Tanah urug padas padat untuk reklamasi lahan rawa, pengurugan pekarangan & tapak bangunan.',
    fullDescription: 'Tanah timbunan merah/padas berkualitas tinggi tanpa sampah organik dan bukan lumpur lembek. Memiliki daya dukung tanah yang baik setelah dipadatkan. Menjadi pilihan utama kontraktor di Nabire untuk meratakan lahan pekarangan, menimbun rawa gambut, dan meninggikan peil lantai bangunan agar bebas genangan banjir.',
    useCases: [
      'Tanah untuk penimbunan lahan rawa & lereng',
      'Tanah untuk pemerataan tanah pekarangan & perumahan',
      'Tanah untuk kebutuhan proyek pembangunan jalan & gedung'
    ],
    pricePerRit: 650000,
    available: true,
    stockRitEstimated: 400,
    imageUrl: '/src/assets/images/product_tanah_timbunan_1794022011281.jpg',
    unit: 'Rit Dump Truck (± 4-5 m³)',
    specs: {
      origin: 'Lokasi Galian Wangar Makmur, Nabire Barat',
      grainSize: 'Tanah Lempung Berpasir Padas',
      color: 'Merah kecokelatan padat',
      density: '± 1.5 - 1.65 ton/m³'
    }
  }
];

export const INITIAL_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone_nabire_barat',
    name: 'Distrik Nabire Barat & Wangar Makmur',
    feePerRit: 100000,
    estimatedTime: '1 - 2 Jam',
    description: 'Area terdekat sekitar quarry Wangar Makmur, Bumi Mulia, Wadio, Kalisusu.'
  },
  {
    id: 'zone_nabire_kota',
    name: 'Nabire Kota (Kalibobo, Oyehe, Karang Mulia, Morgo)',
    feePerRit: 200000,
    estimatedTime: '2 - 3 Jam',
    description: 'Pusat kota Nabire, Girimulyo, Karang Tumaritis, Nabarua, Sanoba.'
  },
  {
    id: 'zone_teluk_kimi',
    name: 'Distrik Teluk Kimi & Pelabuhan Samabusa',
    feePerRit: 250000,
    estimatedTime: '3 - 4 Jam',
    description: 'Kimi, Samabusa, Air Mandidi, kawasan pelabuhan dan pergudangan.'
  },
  {
    id: 'zone_uwapa_topo',
    name: 'Distrik Uwapa / Topo / Kali Harapan',
    feePerRit: 350000,
    estimatedTime: '3 - 5 Jam',
    description: 'Arah pedalaman Uwapa, Topo, jalan poros trans Papua.'
  },
  {
    id: 'zone_pickup',
    name: 'Ambil Sendiri di Quarry Wangar Makmur',
    feePerRit: 0,
    estimatedTime: 'Langsung Muat di Lokasi',
    description: 'Pelanggan membawa dump truck sendiri ke lokasi galian CV KAMINDIPMAN.'
  }
];

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'CV KAMINDIPMAN',
  tagline: 'Supplier Material Bangunan Terpercaya Nabire - Pasir, Batu, Sirtu & Tanah Timbunan',
  description: 'CV KAMINDIPMAN adalah perusahaan penyedia material tambang galian C dan bahan bangunan terkemuka di Nabire, Papua Tengah. Berpusat di Kampung Wangar Makmur, Nabire Barat, kami melayani suplai pasir cor berkualitas, batu fondasi kali, sirtu jalan, dan tanah timbunan untuk proyek pemerintah, swasta, kontraktor, serta kebutuhan hunian masyarakat.',
  adminWhatsApp: '6282137238800',
  alternatePhone: '081344556677',
  email: 'cvkamindipman.nabire@gmail.com',
  quarryLocation: 'Kampung Wangar Makmur, Distrik Nabire Barat, Kabupaten Nabire, Papua Tengah',
  district: 'Nabire Barat',
  city: 'Nabire',
  province: 'Papua Tengah',
  operationalHours: 'Senin - Sabtu: 07.30 - 17.30 WIT (Minggu: Libur Operasional / Janji Temu Proyek)',
  bankAccounts: [
    {
      bank: 'Bank Papua',
      accountNumber: '100-02-1987654-1',
      accountHolder: 'CV KAMINDIPMAN'
    },
    {
      bank: 'Bank Mandiri',
      accountNumber: '154-00-9876543-2',
      accountHolder: 'CV KAMINDIPMAN'
    },
    {
      bank: 'Bank BRI',
      accountNumber: '0382-01-002345-53-8',
      accountHolder: 'CV KAMINDIPMAN'
    }
  ],
  // Pre-hashed default password for "kamindipman2026"
  // SHA-256 of "kamindipman2026"
  adminPasswordHash: '439031ef09c3a3b49bb1e17d74db1fdf4d1cbb0f595085d7b077a940428d052d'
};

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord_100',
    orderCode: 'KMD-202611-1015',
    customerName: 'Karel Gobai (Mandor Proyek)',
    customerPhone: '081248765432',
    customerEmail: 'karel.gobai@gmail.com',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Pemuda No. 45, Samping Gereja GKI, Nabire Kota',
    deliveryDistrict: 'Nabire Kota',
    deliveryNotes: 'Material pasir cor telah dibongkar tepat di lokasi pengecoran lantai 2.',
    items: [
      {
        productId: 'prod_pasir_01',
        productName: 'Pasir Bangunan & Pengecoran',
        category: 'pasir',
        rit: 5,
        pricePerRit: 1250000,
        subtotal: 6250000
      }
    ],
    subtotalMaterial: 6250000,
    shippingFee: 1000000,
    totalAmount: 7250000,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderStatus: 'pesanan_selesai',
    createdAt: '2026-11-04T07:15:00Z',
    updatedAt: '2026-11-04T16:30:00Z',
    paymentDetails: {
      gateway: 'midtrans',
      channel: 'va_bca',
      transactionId: 'TRX-MID-981244',
      paidAt: '2026-11-04T07:30:00Z'
    },
    adminNotes: 'Pengiriman 5 rit dump truck tuntas dibongkar, tanda terima nota fisik telah ditandatangani mandor.'
  },
  {
    id: 'ord_101',
    orderCode: 'KMD-202611-1029',
    customerName: 'Yohanes Dogopia',
    customerPhone: '081240987654',
    customerEmail: 'yohanes.d@gmail.com',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Poros Bumi Mulia No. 18, Depan Balai Desa',
    deliveryDistrict: 'Distrik Nabire Barat',
    deliveryNotes: 'Dump truck harap masuk mundur ke pekarangan proyek rumah.',
    items: [
      {
        productId: 'prod_pasir_01',
        productName: 'Pasir Bangunan & Pengecoran',
        category: 'pasir',
        rit: 3,
        pricePerRit: 1250000,
        subtotal: 3750000
      }
    ],
    subtotalMaterial: 3750000,
    shippingFee: 300000,
    totalAmount: 4050000,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderStatus: 'dalam_pengiriman',
    createdAt: '2026-11-05T08:30:00Z',
    updatedAt: '2026-11-06T14:20:00Z',
    paymentDetails: {
      gateway: 'midtrans',
      channel: 'qris',
      transactionId: 'TRX-MID-992384',
      paidAt: '2026-11-05T08:45:12Z'
    },
    adminNotes: 'Armada Unit DT-02 Driver Bpk. Agus sedang meluncur ke lokasi.'
  },
  {
    id: 'ord_102',
    orderCode: 'KMD-202611-1035',
    customerName: 'PT Papua Cipta Karya (Ir. Hendra)',
    customerPhone: '081398223344',
    customerEmail: 'logistik.pck@gmail.com',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Proyek Pembangunan Kantor Dinas, Jl. Pepera No. 4, Karang Mulia',
    deliveryDistrict: 'Nabire Kota',
    deliveryNotes: 'Akses jalan aspal lebar, dump truck besar roda 6 muat bebas.',
    items: [
      {
        productId: 'prod_batu_02',
        productName: 'Batu Belah & Batu Pecah Fondasi',
        category: 'batu',
        rit: 5,
        pricePerRit: 1450000,
        subtotal: 7250000
      },
      {
        productId: 'prod_sirtu_03',
        productName: 'Sirtu (Pasir Batu Pengerasan)',
        category: 'sirtu',
        rit: 5,
        pricePerRit: 950000,
        subtotal: 4750000
      }
    ],
    subtotalMaterial: 12000000,
    shippingFee: 2000000,
    totalAmount: 14000000,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    orderStatus: 'pesanan_diproses',
    createdAt: '2026-11-06T09:15:00Z',
    updatedAt: '2026-11-06T11:00:00Z',
    paymentDetails: {
      gateway: 'midtrans',
      channel: 'va_mandiri',
      transactionId: 'TRX-MID-993102',
      paidAt: '2026-11-06T09:30:45Z'
    },
    adminNotes: 'Muatan sedang disiapkan excavator di quarry Wangar Makmur.'
  },
  {
    id: 'ord_103',
    orderCode: 'KMD-202611-1048',
    customerName: 'Markus Wenda',
    customerPhone: '082233445566',
    customerEmail: '',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Samabusa Jalur 2, Dekat Pasar Ikan',
    deliveryDistrict: 'Distrik Teluk Kimi',
    deliveryNotes: 'Mohon telepon sebelum armada keluar dari quarry.',
    items: [
      {
        productId: 'prod_tanah_04',
        productName: 'Tanah Timbunan & Pemerataan Lahan',
        category: 'tanah_timbunan',
        rit: 4,
        pricePerRit: 650000,
        subtotal: 2600000
      }
    ],
    subtotalMaterial: 2600000,
    shippingFee: 1000000,
    totalAmount: 3600000,
    paymentMethod: 'cod',
    paymentStatus: 'cod_pending',
    orderStatus: 'menunggu_konfirmasi',
    createdAt: '2026-11-06T13:40:00Z',
    updatedAt: '2026-11-06T13:40:00Z',
    adminNotes: 'Menunggu konfirmasi mandor terkait ketersediaan dump truck sore.'
  }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testi_1',
    orderCode: 'KMD-202610-0982',
    name: 'Ir. Robertus Kogoya',
    role: 'Project Manager & Struktur',
    companyOrProject: 'PT Cendrawasih Papua Karya (Proyek Gedung Kantor Nabire)',
    district: 'Distrik Nabire Kota',
    category: 'kontraktor',
    categoryLabel: 'Kontraktor Gedung',
    rating: 5,
    materialSupplied: 'Pasir Cor Struktur & Batu Belah',
    verifiedVolume: '85 Rit',
    content: 'Pasokan pasir cor dan batu belah dari quarry Wangar Makmur selalu konsisten. Kadar lumpur pasirnya sangat rendah sehingga uji tekan beton struktur kami memenuhi spesifikasi teknis K-300 tanpa kendala. Jadwal pengiriman dump truck sangat disiplin saat agenda pengecoran massal.',
    createdAt: '2026-11-01T08:00:00Z',
    isVerified: true
  },
  {
    id: 'testi_2',
    orderCode: 'KMD-202610-0955',
    name: 'Bpk. Fransiskus Pigome',
    role: 'Kontraktor Sipil & Infrastruktur',
    companyOrProject: 'CV Bintang Papua Makmur (Proyek Lapis Pondasi Jalan Desa)',
    district: 'Distrik Nabire Barat',
    category: 'jalan',
    categoryLabel: 'Infrastruktur Jalan',
    rating: 5,
    materialSupplied: 'Sirtu Gradasi Padat & Batu Split',
    verifiedVolume: '140 Rit',
    content: 'Material sirtu dari CV KAMINDIPMAN memiliki proporsi kerikil dan pasir pengikat yang pas. Saat digilas vibro roller langsung padat mengunci, mempercepat pekerjaan subgrade jalan perumahan. Muatan rit dump truck selalu munjung dan jujur tanpa dikurangi.',
    createdAt: '2026-11-03T10:30:00Z',
    isVerified: true
  },
  {
    id: 'testi_3',
    orderCode: 'KMD-202610-0920',
    name: 'Ibu Maria Douw, S.E.',
    role: 'Owner Ruko Komersial & Rumah Tinggal',
    companyOrProject: 'Pembangunan Ruko 2 Lantai Jl. Poros Kalibobo',
    district: 'Nabire Kota (Kalibobo)',
    category: 'hunian',
    categoryLabel: 'Hunian & Ruko',
    rating: 5,
    materialSupplied: 'Pasir Pasang, Plester & Batu Fondasi',
    verifiedVolume: '24 Rit',
    content: 'Sangat praktis bisa memesan langsung dari website dan memilih pembayaran COD saat dump truck tiba. Pasirnya bersih, adukan semen jadi hemat dan plesteran dinding tidak retak rambut. Pelayanan admin WhatsApp sangat cepat dan ramah.',
    createdAt: '2026-11-04T14:15:00Z',
    isVerified: true
  },
  {
    id: 'testi_4',
    orderCode: 'KMD-202610-0890',
    name: 'Bpk. Hendrikus Waine',
    role: 'Mandor Lapangan & Pengurugan',
    companyOrProject: 'Proyek Reklamasi & Pemerataan Tapak Gudang Logistik',
    district: 'Distrik Nabire Barat (Bumi Mulia)',
    category: 'jalan',
    categoryLabel: 'Pengurugan Lahan',
    rating: 5,
    materialSupplied: 'Tanah Timbunan Padas Super',
    verifiedVolume: '60 Rit',
    content: 'Tanah timbunan merah padasnya berdaya dukung tinggi dan bukan tanah gambut berair. Lahan rawa seluas 1.200 m² berhasil kami ratakan tepat waktu karena dump truck CV KAMINDIPMAN beroperasi kontinyu dari stockpile Wangar Makmur.',
    createdAt: '2026-11-05T09:00:00Z',
    isVerified: true
  }
];

