export interface CancellationPenaltyModel {
  originalPrice: number;
  penaltyPercent: number;
  penaltyAmount: number;
  refundAmount: number;
  hoursUntilMatch: number;
}
