import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodmall';

const PopupSchema = new mongoose.Schema({
  title: String, type: String, imageUrl: String, youtubeUrl: String,
  top: Number, left: Number, width: Number, height: Number,
  linkUrl: String, linkTarget: String, startDate: Date, endDate: Date,
  isActive: Boolean, sortOrder: Number,
}, { timestamps: true });

const StoreSchema = new mongoose.Schema({
  name: String, region: String, address: String, jibunAddress: String,
  phone: String, latitude: Number, longitude: Number, businessHours: String,
  imageUrl: String, description: String, isActive: Boolean, sortOrder: Number,
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Popup = mongoose.models.Popup || mongoose.model('Popup', PopupSchema);
  const Store = mongoose.models.Store || mongoose.model('Store', StoreSchema);

  // Clear existing data
  await Popup.deleteMany({});
  await Store.deleteMany({});

  // Seed popups
  await Popup.insertMany([
    {
      title: '신메뉴 출시 안내',
      type: 'image',
      imageUrl: '/images/popup/popup1.jpg',
      youtubeUrl: '',
      top: 150, left: 100, width: 500, height: 600,
      linkUrl: '', linkTarget: '_blank',
      startDate: new Date(), endDate: new Date('2027-12-31'),
      isActive: true, sortOrder: 1,
    },
    {
      title: '가맹점 모집 안내',
      type: 'image',
      imageUrl: '/images/popup/popup2.jpg',
      youtubeUrl: '',
      top: 150, left: 650, width: 500, height: 600,
      linkUrl: '#contact', linkTarget: '_self',
      startDate: new Date(), endDate: new Date('2027-12-31'),
      isActive: true, sortOrder: 2,
    },
  ]);

  // Seed stores (wandduk.com 실제 데이터)
  await Store.insertMany([
    { name: '본점', region: '대구', address: '대구 동구 팔공로51길 31-10 1동 102호', jibunAddress: '대구 동구 봉무동 1543-4', phone: '', latitude: 35.9222540857069, longitude: 128.636783159291, isActive: true, sortOrder: 1 },
    { name: '고성점', region: '대구', address: '대구 북구 고성북로 51', jibunAddress: '대구 북구 고성동3가 40-5', phone: '', latitude: 35.88430605024876, longitude: 128.58395187473909, isActive: true, sortOrder: 2 },
    { name: '매천점', region: '대구', address: '대구 북구 매전로4길 32 한신더휴웨스턴팰리스상가(509,510,111)호', jibunAddress: '대구 북구 매천동 750', phone: '', latitude: 35.904337979982834, longitude: 128.5433356009469, isActive: true, sortOrder: 3 },
    { name: '경산사동점', region: '경북', address: '경북 경산시 백양로 107', jibunAddress: '경북 경산시 사동 607-6', phone: '', latitude: 35.8138772447358, longitude: 128.753733755249, isActive: true, sortOrder: 4 },
    { name: '경산옥산점', region: '경북', address: '경북 경산시 경산로 191', jibunAddress: '경북 경산시 옥산동 132-2', phone: '', latitude: 35.8251851485651, longitude: 128.725774466118, isActive: true, sortOrder: 5 },
    { name: '부산본점', region: '부산', address: '부산 부산진구 동평로73번길 33 1층', jibunAddress: '부산 부산진구 당감동 742-3', phone: '', latitude: 35.1666759834348, longitude: 129.037427963304, isActive: true, sortOrder: 6 },
    { name: '온천점', region: '부산', address: '부산 동래구 온천장로119번길 58-7 1층', jibunAddress: '부산 동래구 온천동 145-22', phone: '', latitude: 35.2223086213132, longitude: 129.081829996077, isActive: true, sortOrder: 7 },
    { name: '대구테크노폴리스점', region: '대구', address: '대구 달성군 유가읍 테크노북로 260 201동 1층 b104~b106호', jibunAddress: '대구 달성군 유가읍 봉리 660', phone: '', latitude: 35.6911550045105, longitude: 128.462400057285, isActive: true, sortOrder: 8 },
    { name: '대구성서점', region: '대구', address: '대구 달서구 달구벌대로 1208 1층', jibunAddress: '', phone: '', latitude: 35.8515023857649, longitude: 128.499508394474, isActive: true, sortOrder: 9 },
    { name: '황금점', region: '대구', address: '대구 수성구 범어천로 25 1층', jibunAddress: '대구 수성구 황금동 703-12', phone: '', latitude: 35.8491744139832, longitude: 128.622919034594, isActive: true, sortOrder: 10 },
    { name: '부산시청점', region: '부산', address: '부산 연제구 중앙대로1043번길 50 2층', jibunAddress: '부산 연제구 연산동 1369-9', phone: '', latitude: 35.1817848737743, longitude: 129.075169832073, isActive: true, sortOrder: 11 },
    { name: '만촌점', region: '대구', address: '대구 수성구 달구벌대로 2561 1층', jibunAddress: '대구 수성구 만촌동 1036-18', phone: '', latitude: 35.8592920391972, longitude: 128.642986102945, isActive: true, sortOrder: 12 },
    { name: '동대구점', region: '대구', address: '대구 동구 동부로30길 100-15 1층', jibunAddress: '대구 동구 신천동 308-1', phone: '', latitude: 35.8682933566568, longitude: 128.627801334514, isActive: true, sortOrder: 13 },
    { name: '밀양내이점', region: '경남', address: '경남 밀양시 내이1길 9 1층', jibunAddress: '경남 밀양시 내이동 1204-5', phone: '', latitude: 35.4962531826626, longitude: 128.744566133109, isActive: true, sortOrder: 14 },
    { name: '죽전점', region: '대구', address: '대구 달서구 와룡로 130', jibunAddress: '대구 달서구 감삼동 343', phone: '', latitude: 35.844148465582, longitude: 128.537603230602, isActive: true, sortOrder: 15 },
    { name: '광안리점', region: '부산', address: '부산 수영구 광남로142번길 8 1층', jibunAddress: '부산 수영구 광안동 194-2', phone: '', latitude: 35.1536474825293, longitude: 129.117686447409, isActive: true, sortOrder: 16 },
    { name: '동성로점', region: '대구', address: '대구 중구 동성로1길 16 1층 102호', jibunAddress: '', phone: '', latitude: 35.8665595850499, longitude: 128.594479007342, isActive: true, sortOrder: 17 },
    { name: '센텀점', region: '부산', address: '부산 해운대구 센텀3로 26 센텀스퀘어 1층 106,107,108호', jibunAddress: '부산 해운대구 우동 1506', phone: '', latitude: 35.1671509103775, longitude: 129.133464374305, isActive: true, sortOrder: 18 },
    { name: '부산서면일번가점', region: '부산', address: '부산 부산진구 중앙대로691번길 48 1층', jibunAddress: '부산 부산진구 부전동 520-35', phone: '', latitude: 35.154632108097, longitude: 129.056392070094, isActive: true, sortOrder: 19 },
    { name: '구미인동점', region: '경북', address: '경북 구미시 인동38길 9-5 1층', jibunAddress: '경북 구미시 구평동 448-2', phone: '054-475-3651', latitude: 36.0932357885515, longitude: 128.433346615625, isActive: true, sortOrder: 20 },
    { name: '수성못점', region: '대구', address: '대구 수성구 용학로 156 1층', jibunAddress: '대구 수성구 지산동 1183-4', phone: '', latitude: 35.8230342313552, longitude: 128.625911101894, isActive: true, sortOrder: 21 },
    { name: '부산화명점', region: '부산', address: '부산 북구 금곡대로285번길 13 1층 106, 107, 108호', jibunAddress: '부산 북구 화명동 2287-2', phone: '', latitude: 35.233722058171, longitude: 129.012737627721, isActive: true, sortOrder: 22 },
    { name: '해운대좌동점', region: '부산', address: '부산 해운대구 양운로 112-10 1층', jibunAddress: '부산 해운대구 좌동 889', phone: '', latitude: 35.1731189370879, longitude: 129.173861539603, isActive: true, sortOrder: 23 },
    { name: '대구신암점', region: '대구', address: '대구 동구 큰고개로 1 1층', jibunAddress: '대구 동구 신암동 136-173', phone: '', latitude: 35.8851636183788, longitude: 128.626572715053, isActive: true, sortOrder: 24 },
    { name: '창원중동점', region: '경남', address: '경남 창원시 의창구 중동중앙로 79 103, 104, 105, 106호', jibunAddress: '경남 창원시 의창구 중동 776-1', phone: '055-253-3651', latitude: 35.2590714057611, longitude: 128.626834672254, isActive: true, sortOrder: 25 },
    { name: '대구월배점', region: '대구', address: '대구 달서구 진천로 93 1층 111, 112, 113호', jibunAddress: '대구 달서구 대천동 550-3', phone: '', latitude: 35.816664851856, longitude: 128.522452972547, isActive: true, sortOrder: 26 },
    { name: '대구다사점', region: '대구', address: '대구 달성군 다사읍 달구벌대로 855 1층', jibunAddress: '대구 달성군 다사읍 매곡리 1546-4', phone: '', latitude: 35.8597028449723, longitude: 128.463721378886, isActive: true, sortOrder: 27 },
    { name: '대구두류점', region: '대구', address: '대구 달서구 달구벌대로 1762 1층 102호, 103호', jibunAddress: '대구 달서구 두류동 148-1', phone: '053-657-5655', latitude: 35.8573477139657, longitude: 128.558437584118, isActive: true, sortOrder: 28 },
  ]);

  console.log('Seed completed: 2 popups, 28 stores');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
