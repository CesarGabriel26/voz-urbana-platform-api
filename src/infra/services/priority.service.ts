import { Complaint } from "../../core/models/complaint.model";

export interface PriorityFactors {
  density: number; // problems_within_raio
  recurrence: number; // historical_recurrence
  urgency: number; // manual_urgency (0, 50, 100)
}

export class PriorityService {
  // Normalized weights (Wi redistribution)
  private readonly Wc = 0.256; // Category
  private readonly Wt = 0.209; // Time Open
  private readonly Wv = 0.174; // Population Confirmations (Votes)
  private readonly Wd = 0.140; // Urban Density
  private readonly Wr = 0.093; // Historical Recurrence
  private readonly Ws = 0.070; // Textual Severity
  private readonly Wu = 0.058; // Administrative Urgency

  calculatePriority(
    complaint: Complaint,
    categoryWeight: number,
    factors: PriorityFactors
  ): number {
    const C = categoryWeight * 10; // Assuming category weight is 1-10, normalizing to 0-100
    const T = this.calculateTimeFactor(complaint);
    const V = this.calculateVoteFactor(complaint.votes || 0);
    const D = this.calculateDensityFactor(factors.density);
    const R = this.calculateRecurrenceFactor(factors.recurrence);
    const S = this.calculateSeverityFactor(complaint.description);
    const U = factors.urgency;

    let priorityScore =
      (C * this.Wc) +
      (T * this.Wt) +
      (V * this.Wv) +
      (D * this.Wd) +
      (R * this.Wr) +
      (S * this.Ws) +
      (U * this.Wu);

    const aging = this.calculateAgingFactor(complaint);
    
    return Math.min(priorityScore * aging, 100);
  }

  private calculateTimeFactor(complaint: Complaint): number {
    const createdAt = new Date(complaint.createdAt);
    const now = new Date();
    const daysOpen = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min((daysOpen / 30) * 100, 100);
  }

  private calculateVoteFactor(votes: number): number {
    // V = min( log(1 + confirmacoes) / log(51) * 100 , 100 )
    if (votes <= 0) return 0;
    const factor = (Math.log(1 + votes) / Math.log(51)) * 100;
    return Math.min(factor, 100);
  }

  private calculateDensityFactor(problemsInRadius: number): number {
    // D = min( (problemas_raio / 20) * 100 , 100 )
    return Math.min((problemsInRadius / 20) * 100, 100);
  }

  private calculateRecurrenceFactor(recurrences: number): number {
    // R = min((reincidencias / 10) * 100 , 100)
    return Math.min((recurrences / 10) * 100, 100);
  }

  private calculateSeverityFactor(description: string): number {
    const keywords: Record<string, number> = {
      'perigo': 80,
      'acidente': 90,
      'alagamento': 85,
      'queda': 70,
      'risco': 75,
      'emergência': 95,
      'grave': 85,
      'urgente': 80,
      'morte': 100,
      'ferido': 90
    };

    let maxScore = 0;
    const lowerDesc = description.toLowerCase();

    for (const [word, score] of Object.entries(keywords)) {
      if (lowerDesc.includes(word)) {
        maxScore = Math.max(maxScore, score);
      }
    }

    return maxScore;
  }

  private calculateAgingFactor(complaint: Complaint): number {
    // aging = 1 + (dias_aberto / 90)
    const createdAt = new Date(complaint.createdAt);
    const now = new Date();
    const daysOpen = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return 1 + (daysOpen / 90);
  }
}
