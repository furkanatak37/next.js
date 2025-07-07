import path from 'path';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const OUNCES_TO_GRAMS = 31.1035;
  const FALLBACK_GOLD_PRICE_PER_GRAM = 107.7; //api hata verirse diye sabit bir fiyat
  
  let goldPricePerGram;

  try {
    const apiKey = '1MJEUPNZOLGO1ANN4DA5133NN4DA5'; 
    const requestUrl = `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz`;
    
    const apiRes = await fetch(requestUrl);
    
    if (!apiRes.ok) {
      const errorBody = await apiRes.text();
      throw new Error(`Altın API'si ${apiRes.status} koduyla başarısız oldu. Gelen yanıt: ${errorBody}`);
    }

    const apiData = await apiRes.json();
    
    if (typeof apiData?.metals?.gold !== 'number') {
      throw new Error(`API yanıtında beklenen altın verisi (metals.gold) bulunamadı veya bir sayı değil.`);
    }
    
    goldPricePerGram = apiData.metals.gold / OUNCES_TO_GRAMS;
    console.log(`API'den canlı altın fiyatı alındı: ${goldPricePerGram.toFixed(2)} USD/gram`);

  } catch (error) {
    console.warn("UYARI: Canlı altın fiyatı alınamadı. Varsayılan değer kullanılıyor.");
    console.warn("Hata Detayı:", error.message);
    goldPricePerGram = FALLBACK_GOLD_PRICE_PER_GRAM;
  }


  try {
    const jsonDirectory = path.join(process.cwd(), 'public');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'products.json'), 'utf8');
    const products = JSON.parse(fileContents);
    
    const productsWithLivePrices = products.map(product => {
      const popularity = typeof product.popularityScore === 'number' ? product.popularityScore : 0;
      const weight = typeof product.weight === 'number' ? product.weight : 0;

      if (weight === 0) {
        console.warn(`UYARI: '${product.name}' adlı ürün için 'weight' bulunamadı veya sıfır.`);
      }

      const calculatedPrice = (popularity + 1) * weight * goldPricePerGram;
      
      return { 
        ...product, 
        price: parseFloat(calculatedPrice.toFixed(2)) 
      };
    });
    
    return res.status(200).json(productsWithLivePrices);

  } catch (error) {
    console.error("Ürün dosyası okunurken veya işlenirken hata:", error.message);
    return res.status(500).json({ message: 'Ürün verileri işlenemedi.' });
  }
}