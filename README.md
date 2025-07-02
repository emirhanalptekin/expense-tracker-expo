# Expense Tracker Mobile Application

## Proje Özeti

Bu proje, React Native ve Firebase teknolojileri kullanılarak geliştirilmiş bir kişisel finans yönetim uygulamasıdır. Kullanıcılar gelir ve giderlerini kategorize ederek takip edebilir, finansal durumlarını görsel grafiklerle analiz edebilirler.

## Teknik Altyapı

### Frontend
- React Native (Expo framework)
- TypeScript
- Expo Router (file-based navigation)
- React Context API
- React Native Reanimated

### Backend
- Firebase Authentication
- Firebase Firestore
- AsyncStorage

## Uygulama Fonksiyonları

### Tamamlanan Özellikler

1. **Kullanıcı Yönetimi**
   - Email/şifre ile kayıt ve giriş
   - Oturum bilgilerinin kalıcı saklanması
   - Kullanıcı profil yönetimi

2. **İşlem Yönetimi**
   - Gelir/gider ekleme
   - 12 farklı kategori desteği
   - İşlem silme (uzun basma)
   - Tarih ve not alanları

3. **Veri Görselleştirme**
   - Ana panel özet görünümü
   - 4 haftalık bar grafik
   - Kategori bazlı analiz
   - Gerçek zamanlı bakiye güncelleme

4. **Veri Senkronizasyonu**
   - Firestore ile anlık güncelleme
   - Çoklu cihaz desteği
   - Offline çalışma kabiliyeti

### Eksik Kalan Özellikler

1. **Bütçe Modülü**
   - Aylık bütçe limiti belirleme özelliği tamamlanamadı
   - Bütçe aşımı uyarıları eklenemedi

2. **Raporlama**
   - PDF/Excel dışa aktarım modülü yazılamadı
   - Detaylı aylık/yıllık raporlar eksik

3. **Gelişmiş Özellikler**
   - Push notification sistemi kurulamadı
   - Fatura/fiş fotoğrafı ekleme özelliği yok
   - Çoklu para birimi desteği eklenemedi

4. **UI/UX İyileştirmeleri**
   - Karanlık tema desteği yok
   - Arama ve filtreleme özellikleri sınırlı
   - Yinelenen işlemler (recurring transactions) özelliği eksik

## Teknik Zorluklar ve Çözümler

### Karşılaşılan Sorunlar

1. **Firebase Auth Persistence**
   - AsyncStorage entegrasyonunda tip uyumsuzlukları yaşandı
   - Çözüm: Type assertion kullanılarak geçici çözüm uygulandı

2. **Real-time Updates**
   - İlk implementasyonda bakiye güncellemeleri gecikmeli yansıyordu
   - Çözüm: onSnapshot listener'lar ile doğrudan hesaplama yapıldı

3. **TypeScript Strict Mode**
   - Bazı Firebase type tanımlamaları eksikti
   - Çözüm: Custom type interface'ler oluşturuldu

## Proje Yapısı

```
app/                    # Expo Router sayfaları
├── (tabs)/            # Tab navigasyon grubu
├── _layout.tsx        # Root layout with auth provider
├── login.tsx          # Authentication screen
└── add-transaction.tsx # Modal for new transactions

src/                   # Core application logic
├── config/           # Firebase configuration
├── context/          # Authentication context
├── services/         # Firestore service layer
└── components/       # Reusable components
```

## Veritabanı Mimarisi

Firestore NoSQL yapısı kullanılmıştır:
- `users/` collection: Kullanıcı profil ve özet bilgileri
- `transactions/` collection: Tüm gelir/gider kayıtları

Her transaction kaydı userId foreign key ile kullanıcıya bağlanmıştır.

## Güvenlik

- Firestore Security Rules ile row-level security
- Authentication guard component ile route koruması
- Input validation ve sanitization

## Performans Notları

- FlatList yerine SectionList kullanılarak gruplu render optimizasyonu
- useMemo hook'u ile gereksiz re-render'lar önlendi
- Firestore query limitleri ile veri transferi optimize edildi

## Kurulum ve Çalıştırma

```bash
npm install
# Firebase config dosyasını düzenleyin
npx expo start
```

## APK Build

```bash
eas build -p android --profile preview
```

## Gelecek Geliştirmeler

Zaman kısıtı nedeniyle tamamlanamayan ancak planlanan özellikler:
- Biometric authentication
- Cloud backup/restore
- Widget desteği
- Makine öğrenmesi ile harcama tahmini

## Değerlendirme

Proje, temel finansal takip ihtiyaçlarını karşılayacak şekilde tamamlanmıştır. React Native ve Firebase entegrasyonu başarıyla gerçekleştirilmiş, kullanılabilir bir MVP (Minimum Viable Product) ortaya çıkarılmıştır. Eksik kalan özellikler, projenin bir sonraki iterasyonunda tamamlanabilir.

---

**Geliştirme Süresi**: 2 hafta  
**Toplam Commit**: 47  
**Test Coverage**: Manuel test
