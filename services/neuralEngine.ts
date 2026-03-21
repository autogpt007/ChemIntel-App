
import natural from 'natural';

export class NeuralEngine {
  private analyzer: natural.SentimentAnalyzer;
  private tokenizer: natural.WordTokenizer;

  constructor() {
    this.analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    this.tokenizer = new natural.WordTokenizer();
  }

  analyzeSentiment(text: string): 'Positive' | 'Negative' | 'Neutral' {
    const tokens = this.tokenizer.tokenize(text);
    const score = this.analyzer.getSentiment(tokens);
    
    if (score > 0.2) return 'Positive';
    if (score < -0.2) return 'Negative';
    return 'Neutral';
  }

  extractKeywords(text: string): string[] {
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    // Basic keyword extraction: filter out short words and common stop words
    const stopWords = ['the', 'and', 'for', 'with', 'this', 'that', 'from'];
    return tokens.filter(t => t.length > 3 && !stopWords.includes(t));
  }
}

export const neuralEngine = new NeuralEngine();
