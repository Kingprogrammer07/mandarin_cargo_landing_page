const content = {



  // How It Works
  howItWorks: {
    eyebrow: "JARAYON",
    h2: "5 qadamda boshlang",
    subtitle: "Barchasi Telegram orqali \u2014 tez va oson",
    steps: [
      {
        icon: "Smartphone",
        title: "Botda ro'yxatdan o'ting",
        desc: "/start bosing. Ism, passport ma'lumotlari va rasmini yuboring.",
      },
      {
        icon: "ShieldCheck",
        title: "Admin tekshiruvi",
        desc: "Ma'lumotlaringiz 24 soat ichida admin tomonidan tasdiqlanadi.",
      },
      {
        icon: "Key",
        title: "Shaxsiy ID kod",
        desc: "Sizga Xitoydagi ombor manzili va shaxsiy ID kodingiz beriladi.",
      },
      {
        icon: "ShoppingCart",
        title: "Xarid qiling",
        desc: "Xitoy do'koniga ombor manzili + ID kodingizni ko'rsating. Tovar omborga keladi.",
      },
      {
        icon: "Plane",
        title: "Yetkazib berish",
        desc: "Havo orqali Toshkentga yetkazamiz. Olib ketasiz yoki yetkazib beramiz.",
      },
    ],
    idLabel: "Sizning shaxsiy ID kodingiz",
    idCode: "SXXX",
    idCaption: "Bu kod har bir yukingiz bilan birga keladi",
    addressLabel: "Xitoydagi ombor manzili",
    address: [
      "SXXX 18161955318",
      "陕西省咸阳市渭城区 北杜街道",
      "昭容南街东航物流园内中京仓SXXX号仓库",
    ],
  },

  // Calculator
  track: {
    eyebrow: "KUZATUV",
    h2: "Yukingizni kuzating",
    subtitle: "Trek kodingizni kiriting — holatini real vaqtda ko'ring.",
    placeholder: "Masalan: SAAS30-12345",
    button: "Tekshirish",
    checking: "Tekshirilmoqda...",
    weightLabel: "Og'irlik",
    progressLabel: "Bajarildi",
    statusAvailable: "Bajarildi",
    statusPending: "Jarayonda",
    statusNodata: "Kutilmoqda",
    steps: ["Xitoy omborida", "Yo'lda", "Bojxona navbatida", "Saralash bosqichida", "Yetkazishga tayyor", "Olib ketilgan"],
    notFound: "Bunday trek kod topilmadi. Kodni tekshiring.",
    tooShort: "Trek kod kamida 3 ta belgidan iborat bo'lsin.",
    rateLimit: "Juda ko'p so'rov. Bir daqiqadan so'ng qayta urinib ko'ring.",
    errorGeneric: "Internetingizni tekshiring: ulanishda muammo bo'lishi mumkin.",
  },

  calculator: {
    eyebrow: "KALKULYATOR",
    h2: "Yukingiz narxini hisoblang",
    subtitle: "1 kg dan boshlab, minimalkasiz",
    weightLabel: "Og'irlik (kg)",
    weightPlaceholder: "0.5",
    volumetricToggle: "Gabarit hisobi",
    volumetricDesc: "Agar yukingiz katta hajmli bo'lsa",
    length: "Uzunlik",
    width: "Kenglik",
    height: "Balandlik",
    dimPlaceholder: "30",
    dimUnit: "sm",
    submit: "Hisoblash",
    calculating: "Hisoblanmoqda...",
    resultLabel: "Taxminiy narx:",
    perKg: "$9.5 / kg",
    calculatedWeight: "Hisoblangan og'irlik",
    real: "Haqiqiy",
    volumetric: "Gabarit",
    exchangeRate: "Kurs",
    fallbackNotice: "*Taxminiy hisoblagich. Aniq narx uchun Telegram botga murojaat qiling.",
    cta: "Ro'yxatdan o'tish",
    ctaSub: "Bepul shaxsiy ID kod oling",
    error: "Internetingizni tekshiring: ulanishda muammo bo'lishi mumkin.",
    errorTitle: "Hisoblab bo'lmadi",
    retry: "Qayta urinish",
  },



  // Pricing
  pricing: {
    eyebrow: "TARIFLAR",
    h2: "Shaffof tariflar",
    subtitle: "Yuk turiga qarab 3 xil tarif. Minimal to'lovsiz.",
    tiers: [
      {
        name: "Oddiy yuklar",
        price: "$9.5",
        unit: "/ kg",
        desc: "Kundalik tovarlar (kiyim, jihoz, ehtiyot qism va h.k.) uchun standart havo kargo narxi.",
      },
      {
        name: "Brend yuklar",
        oldPrice: "$13",
        price: "$11",
        unit: "/ kg",
        desc: "Original brend mahsulotlar (Nike, Adidas, Apple va boshqalar) uchun. Brend tovarlar qo'shimcha tekshiruv va ehtiyotkorlik bilan tashilgani uchun narx bir oz yuqori.",
      },
      {
        name: "Seriya yuklar",
        price: "$12",
        unit: "/ kg",
        desc: "Bitta xil mahsulotdan 3 donadan ko'p buyurtma qilsangiz, yuk tijorat (seriya) hisoblanadi va shu tarif bo'yicha narxlanadi.",
        badges: [
          "Elektronika (batareya/tokli mahsulotlar)",
          "Kosmetikaga aloqador mahsulotlar",
        ],
      },
    ],
    popularBadge: "Ommabop",
    includedTitle: "Barcha tariflarga kiradi",
    included: [
      "Havo orqali yetkazib berish (3\u20137 kun)",
      "Xitoy omborida bepul saqlash (7 kun)",
      "Jonli kuzatuv (Telegram + Web)",
      "Xitoyda sotib olish xizmati (kelajakda)",
      "Yuk sug'urtasi",
    ],
    note: "Yakuniy narx tovar turi va og'irligiga qarab aniqlanadi.",
    bonus: "Gabarit (hajmli) yuklar uchun maxsus bonus mavjud.",
    cta: "Hisoblash",
  },



  // FAQ
  faq: {
    eyebrow: "SAVOLLAR",
    h2: "Ko'p so'raladigan savollar",
    items: [
      {
        q: "Qanday boshlayman?",
        a: "Telegram botimizga @mandarincargobot ga kiring va /start bosing. Ro'yxatdan o'tish shaxsiy ma'lumotlaringizni (ism, passport, rasm) yuborishdan iborat. Admin tasdiqlagach, sizga shaxsiy ID kod va Xitoydagi ombor manzili beriladi.",
      },
      {
        q: "Yetkazish qancha vaqt oladi?",
        a: "Xitoy omborimizdan Toshkentgacha havo orqali 3\u20137 kun. Bu sellerdan omborga yetib kelish vaqtini hisobga olmaydi. Reyslar haftada bir necha marta amalga oshiriladi.",
      },
      {
        q: "Qanday to'lov qilaman?",
        a: "Click, Payme, Uzum, Alipay, Uzcard, Humo, NBU orqali onlayn to'lov. Naqd pulni ofisimizda ham qabul qilamiz. To'lov yuk yetib kelgidan so'ng amalga oshiriladi.",
      },
      {
        q: "Qanday tovarlarni tashish mumkin emas?",
        a: "Quyidagilar taqiqlangan: qurol, portlovchi moddalar, narkotiklar, noqonuniy dorilar, radioaktiv moddalar, hayvonlar, tez buziladigi oziq-ovqat, naqshli matolar (import cheklovlari). Shubhali hollarda oldindan so'rang.",
      },
      {
        q: "Yukimni qanday kuzataman?",
        a: "Telegram botimiz <bot>Mandarin Cargo Boti</bot> orqali yukingiz holatini real vaqtda kuzatishingiz mumkin: omborga keldi \u2192 yuklandi \u2192 uchdi \u2192 Toshkentda \u2192 yetkazildi.",
      },
      {
        q: "Passport ma'lumotlari nega kerak?",
        a: "O'zbekiston bojxona qonunchiligiga ko'ra, chet eldan kiritilayotgan yuklar deklaratsiya qilinishi kerak. Passport ma'lumotlaringiz bojxona rasmiylashtiruvi uchun zarur. Ma'lumotlar xavfsiz saqlanadi.",
      },
    ],
  },



  // Structured data
  seo: {
    title: "Xitoydan O'zbekistonga havo kargosi \u2014 Mandarin Cargo",
    description:
      "Xitoydan O'zbekistonga tez va arzon havo kargosi. $9.5/kg dan. Telegram bot orqali ro'yxatdan o'ting. 50\u00a0000+ mijoz ishonchi.",
    keywords: [
      "Mandarin Cargo",
      "Cargo Mandarin",
      "Mandarin Cargo Uzbekistan",
      "Mandarin Cargo Toshkent",
      "mandarin kargo",
      "xitoydan yetkazib berish",
      "havo kargosi",
      "xitoy ombori",
      "cargo uzbekistan",
      "telegram bot cargo",
    ],
  },
  // Live numbers from the Mandarin API (filled at build time)
  live: {
    pricingSubtitle: "Yuk turiga qarab tarif. Minimal to\u2018lovsiz.",
    includedDelivery: "Havo orqali yetkazib berish (o\u2018rtacha {days} kun)",
    featureDelivery: "O\u2018rtacha {days} kunda: Xitoy omboridan Toshkentda olib ketishgacha. Haftada bir necha reys.",
    subheadline: "Havo orqali tez yetkazib berish. 1 kg \u2014 atigi {price} dan. {clients} mijoz bizga ishonadi.",
    subheadlineNoClients: "Havo orqali tez yetkazib berish. 1 kg \u2014 atigi {price} dan.",
    years: "{years} yildan beri",
    clients: "{clients} mijoz",
    delivery: "O\u2018rtacha {days} kunda",
    subscribers: "{count} obunachi",
    reviewsH2: "{clients} mijoz ishonchi",
    reviewCount: "{count} ta baho",
    reviewsH2Plain: "Mijozlarimiz fikri",
    channelCta: "Telegram kanalimiz",
  },
  page: {
    nav: { how: "Jarayon", track: "Kuzatish", pricing: "Narxlar", faq: "Savollar", contact: "Aloqa", cta: "Botni ochish", menu: "Menyu", close: "Yopish" },
    hero: {
      h1: "Xitoydan havo kargo",
      lead: "Taobao, 1688 va Pinduoduo buyurtmalaringiz Xitoydagi omborimizga tushadi, biz ularni samolyotda Toshkentga olib kelamiz.",
      fromCity: "Syanyan, Xitoy",
      toCity: "Toshkent",
      route: "Syanyandagi omborimizdan Toshkentga",
      price: "1 kg narxi",
      transit: "Yo‘lda",
      transitFallback: "3–7 kun",
      transitLive: "{days} kun",
      fromShort: "Syanyan",
      calcCta: "Narxni hisoblash",
      clients: "Mijozlar",
      since: "Ishlaymiz",
      sinceValue: "2019-yildan",
      weight: "Yukingiz og‘irligi",
      dims: "O‘lchamlari bilan",
      result: "Taxminiy narx",
      resultHint: "Og‘irlikni kiriting",
      cta: "Botda shaxsiy kod olish",
      photos: ["Xitoydagi ombor: javonlardagi qutilar", "Saralash liniyasidagi posilkalar", "Toshkentdagi ofis binosi"],
    },
    how: {
      h2: "Botdan eshigingizgacha",
      lead: "Hammasi Telegramda. Ro‘yxatdan o‘tishdan yukni olishgacha besh qadam.",
      prev: "Oldingi qadam",
      next: "Keyingi qadam",
      steps: [
        { title: "Avval botda ro‘yxatdan o‘tasiz", desc: "/start bosing va ism, pasport ma’lumoti hamda rasmingizni yuboring." },
        { title: "Bir kun ichida tasdiqlaymiz", desc: "Admin ma’lumotlaringizni tekshiradi. Bojxona uchun bu majburiy." },
        { title: "Kod va manzil keladi", desc: "Shaxsiy kodingiz va Xitoydagi ombor manzili botga yuboriladi." },
        { title: "Do‘kondan buyurtma berasiz", desc: "Yetkazish manziliga ombor manzili va kodingizni yozasiz." },
        { title: "Samolyotda Toshkentga", desc: "Ofisdan olib ketasiz yoki viloyatlarga pochta orqali jo‘natamiz." },
      ],
      codeLabel: "Shaxsiy kod",
      addressLabel: "Ombor manzili",
    },
    track: {
      h2: "Yukingiz qayerda?",
      lead: "Trek kodni kiriting: Xitoy omboridan qo‘lingizga yetguncha har bir bosqichni ko‘rasiz.",
    },
    sheets: {
      h2: "Siz uchun nima qilamiz",
      items: [
        { title: "Istalgan do‘kondan", desc: "Xitoy do‘koniga ombor manzilimiz va kodingizni yozasiz. Qaysi saytdan bo‘lmasin, tovar omborimizga tushadi." },
        { title: "O‘z omborimiz", desc: "Ombor Syanyandagi aviakargo logistika parkida, Shensi viloyatida. Yuklar shu yerda yig‘iladi, tortiladi va reysga tayyorlanadi." },
        { title: "Har qadamini ko‘rasiz", desc: "Yuk omborga kelganda, reysga yuklanganda va Toshkentga yetganda bot xabar beradi. Web kabinetda ham ko‘rinadi." },
        { title: "Qulay to‘lov", desc: "Yuk yetib kelgach to‘laysiz: Click, Payme, Uzum, Uzcard, Humo, NBU, Alipay yoki ofisda naqd." },
      ],
      appAlt: "Mandarin Cargo ilovasi: yuklar ro‘yxati",
    },
    pricing: {
      h2: "Narx kilogramiga",
      lead: "Yuk turiga qarab tarif. Minimal to‘lov yo‘q, narx hisoblangan og‘irlikdan olinadi.",
      perKg: "1 kg uchun",
      cta: "Botda boshlash",
      included: "Har bir tarifga kiradi",
    },
    proof: {
      h2: "{clients} mijoz",
      h2Plain: "Mijozlarimiz",
      years: "{years} yildan beri ishlaymiz",
      cargo: "{tons} tonna yuk yetkazdik",
      subscribers: "Telegram kanalimizda {count} obunachi",
      rating: "O‘rtacha baho {rating} / 5, {count} ta baho",
      photoAlt: "Xitoydagi omborda qutilar",
    },
    about: {
      h2: "Biz haqimizda",
      paragraphs: [
        "Biz 2019-yildan beri Xitoydan O‘zbekistonga havo yo‘li bilan yuk olib kelamiz. Mandarin Cargo TRITON SUPPLY CHAIN kompaniyasining xizmati.",
        "Omborimiz Xitoyning Shensi viloyatida, Syanyan shahridagi aviakargo logistika parkida. Har bir posilka shu yerda kodingiz bo‘yicha qabul qilinadi va tortiladi.",
        "Toshkentdagi ofisimiz Chilonzorda. Yukingizni o‘zingiz olib ketishingiz yoki viloyatga pochta orqali jo‘natishimiz mumkin.",
      ],
      signoff: "Mandarin Cargo jamoasi",
      role: "TRITON SUPPLY CHAIN",
      hours: "Dushanba–shanba, 10:00–18:30",
      route: "Xaritada ochish",
    },
    faq: { h2: "Savollar" },
    cta: {
      lead: "Ro‘yxatdan o‘tish ikki daqiqa. Shaxsiy kod va Xitoydagi ombor manzili botda keladi.",
      h2: "Birinchi yukingiz",
      text: "Telegram botni oching va /start bosing.",
      button: "Telegram botni ochish",
      admin: "Admin bilan bog‘lanish",
      qr: "Telefon kamerasi bilan skanerlang",
    },
    footer: {
      signoff: "Toshkentda kutamiz",
      message: "Savolingiz bo‘lsa, Telegramda yozing yoki qo‘ng‘iroq qiling.",
      stampAlt: "Ombordagi posilkalar",
      imprint: "© {year} Mandarin Cargo, TRITON SUPPLY CHAIN",
      developer: "Sayt dasturchisi",
    },
  },
} as const;

export default content;
