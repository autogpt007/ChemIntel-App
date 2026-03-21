
export enum ComplexityLevel {
  LOW = 'LOW',       // Simple extraction, formatting, basic Q&A
  MEDIUM = 'MEDIUM', // Multi-step reasoning, data synthesis
  HIGH = 'HIGH'      // Strategic orchestration, complex forecasting, regulatory auditing
}

export enum ModelTier {
  ECONOMY = 'gemini-3.1-flash-lite-preview',
  STANDARD = 'gemini-3-flash-preview',
  PREMIUM = 'gemini-3.1-pro-preview'
}

export interface OptimizationRule {
  taskType: string;
  complexity: ComplexityLevel;
  recommendedModel: ModelTier;
}

class CostOptimizer {
  private totalRequests = 0;
  private totalSavings = 0; // Estimated USD saved vs using Premium for everything
  
  // Estimated costs per 1M tokens (simplified for simulation)
  private costs = {
    [ModelTier.ECONOMY]: 0.1,
    [ModelTier.STANDARD]: 0.5,
    [ModelTier.PREMIUM]: 15.0
  };

  private rules: OptimizationRule[] = [
    { taskType: 'orchestration', complexity: ComplexityLevel.HIGH, recommendedModel: ModelTier.PREMIUM },
    { taskType: 'market_intel', complexity: ComplexityLevel.MEDIUM, recommendedModel: ModelTier.STANDARD },
    { taskType: 'document_recon', complexity: ComplexityLevel.LOW, recommendedModel: ModelTier.ECONOMY },
    { taskType: 'batch_discovery', complexity: ComplexityLevel.LOW, recommendedModel: ModelTier.ECONOMY },
    { taskType: 'compliance_audit', complexity: ComplexityLevel.HIGH, recommendedModel: ModelTier.PREMIUM },
    { taskType: 'logistics_routing', complexity: ComplexityLevel.MEDIUM, recommendedModel: ModelTier.STANDARD },
    { taskType: 'sentiment_analysis', complexity: ComplexityLevel.LOW, recommendedModel: ModelTier.ECONOMY },
    { taskType: 'council_response', complexity: ComplexityLevel.MEDIUM, recommendedModel: ModelTier.STANDARD }
  ];

  optimize(taskType: string, complexity?: ComplexityLevel): ModelTier {
    this.totalRequests++;
    
    const rule = this.rules.find(r => r.taskType === taskType);
    const selectedModel = complexity 
      ? this.mapComplexityToModel(complexity)
      : (rule?.recommendedModel || ModelTier.STANDARD);

    // Calculate simulated savings
    const premiumCost = this.costs[ModelTier.PREMIUM];
    const selectedCost = this.costs[selectedModel];
    this.totalSavings += (premiumCost - selectedCost) * 0.001; // Assuming 1k tokens avg

    return selectedModel;
  }

  private mapComplexityToModel(complexity: ComplexityLevel): ModelTier {
    switch (complexity) {
      case ComplexityLevel.LOW: return ModelTier.ECONOMY;
      case ComplexityLevel.MEDIUM: return ModelTier.STANDARD;
      case ComplexityLevel.HIGH: return ModelTier.PREMIUM;
      default: return ModelTier.STANDARD;
    }
  }

  getStats() {
    return {
      totalRequests: this.totalRequests,
      totalSavings: this.totalSavings.toFixed(4),
      efficiency: ((this.totalSavings / (this.totalRequests * 0.015 || 1)) * 100).toFixed(1) + '%'
    };
  }
}

export const costOptimizer = new CostOptimizer();
