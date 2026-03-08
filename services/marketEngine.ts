
import { ForecastData, MarketSegment } from '../types';

/**
 * The Solid Rock Engine: Simulates market volatility and manages 
 * client-side "Back-end" logic for real-time responsiveness.
 */
export class MarketEngine {
  private static instance: MarketEngine;
  
  private constructor() {}

  static getInstance() {
    if (!MarketEngine.instance) {
      MarketEngine.instance = new MarketEngine();
    }
    return MarketEngine.instance;
  }

  /**
   * Generates a realistic forecast based on current macro-economic 
   * simulation logic. This powers our charts with "Solid Rock" data.
   */
  generateForecast(segment: MarketSegment): ForecastData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const forecast: ForecastData[] = [];
    
    // Base values vary by segment
    let basePrice = 1200;
    if (segment === MarketSegment.SPECIALTY_CHEMICALS || segment === MarketSegment.BIO_BASED) {
      basePrice = 4500;
    } else if (segment === MarketSegment.PHARMA_INGREDIENTS) {
      basePrice = 8500;
    } else if (segment === MarketSegment.INDUSTRIAL_GASES) {
      basePrice = 800;
    }

    let baseDemand = 60;
    let baseSupply = 55;

    for (let i = 0; i < 6; i++) {
      const monthIdx = (currentMonth + i) % 12;
      // Simulation of volatility
      const noise = Math.random() * 5 - 2.5;
      const trend = i * 4; // Upward trend simulation
      
      const demand = Math.round(baseDemand + trend + noise);
      const supply = Math.round(baseSupply + (i * 1.5) + noise);
      const price = Math.round(basePrice + (demand - supply) * 50);

      forecast.push({
        month: months[monthIdx],
        demand,
        supply,
        price,
        confidence: [price * 0.95, price * 1.05]
      });
    }

    return forecast;
  }

  getMarketHeatColor(score: number): string {
    if (score > 80) return 'text-red-500';
    if (score > 60) return 'text-orange-500';
    return 'text-green-500';
  }
}

export const marketEngine = MarketEngine.getInstance();
