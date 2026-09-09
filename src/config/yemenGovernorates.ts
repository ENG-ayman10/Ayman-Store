export interface YemenGovernorate {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
}

export const YEMEN_GOVERNORATES: YemenGovernorate[] = [
  { id: "sanaa-city", nameAr: "أمانة العاصمة (صنعاء)", nameEn: "Sana'a City (Capital)", lat: 15.3694, lng: 44.191 },
  { id: "aden", nameAr: "عدن", nameEn: "Aden", lat: 12.7855, lng: 45.0187 },
  { id: "taiz", nameAr: "تعز", nameEn: "Taiz", lat: 13.5789, lng: 44.0189 },
  { id: "ibb", nameAr: "إب", nameEn: "Ibb", lat: 13.9753, lng: 44.1709 },
  { id: "hadhramaut", nameAr: "حضرموت (المكلا / سيئون)", nameEn: "Hadhramaut (Mukalla / Seiyun)", lat: 14.5425, lng: 49.1242 },
  { id: "marib", nameAr: "مأرب", nameEn: "Marib", lat: 15.46, lng: 45.3242 },
  { id: "hodeidah", nameAr: "الحديدة", nameEn: "Al Hudaydah", lat: 14.7978, lng: 42.9545 },
  { id: "dhamar", nameAr: "ذمار", nameEn: "Dhamar", lat: 14.55, lng: 44.4 },
  { id: "sanaa-prov", nameAr: "محافظة صنعاء", nameEn: "Sana'a Governorate", lat: 15.35, lng: 44.2 },
  { id: "lahj", nameAr: "لحج", nameEn: "Lahj", lat: 13.06, lng: 44.88 },
  { id: "abyan", nameAr: "أبين", nameEn: "Abyan", lat: 13.1287, lng: 45.38 },
  { id: "shabwah", nameAr: "شبوة (عتق)", nameEn: "Shabwah (Ataq)", lat: 14.5375, lng: 46.8319 },
  { id: "mahrah", nameAr: "المهرة (الغيضة)", nameEn: "Al Mahrah (Al Ghaydah)", lat: 16.2079, lng: 52.176 },
  { id: "dali", nameAr: "الضالع", nameEn: "Al Dali", lat: 13.6958, lng: 44.7314 },
  { id: "bayda", nameAr: "البيضاء", nameEn: "Al Bayda", lat: 13.98, lng: 45.57 },
  { id: "amran", nameAr: "عمران", nameEn: "Amran", lat: 15.6594, lng: 43.9439 },
  { id: "hajjah", nameAr: "حجة", nameEn: "Hajjah", lat: 15.69, lng: 43.6 },
  { id: "saada", nameAr: "صعدة", nameEn: "Sa'ada", lat: 16.94, lng: 43.76 },
  { id: "mahweet", nameAr: "المحويت", nameEn: "Al Mahwit", lat: 15.47, lng: 43.545 },
  { id: "raymah", nameAr: "ريمة", nameEn: "Raymah", lat: 14.6289, lng: 43.6019 },
  { id: "jawf", nameAr: "الجوف", nameEn: "Al Jawf", lat: 16.1667, lng: 44.7833 },
  { id: "socotra", nameAr: "أرخبيل سقطرى", nameEn: "Socotra Archipelago", lat: 12.65, lng: 54.0167 },
];
