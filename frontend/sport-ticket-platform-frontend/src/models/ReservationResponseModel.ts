export interface ReservationResponseModel {
  reservationId: number;
  status: string;
  reservationDate: string;
  expiresAt: string;
  ticketId: number | null;
  sportName: string;
  homeTeamName: string;
  awayTeamName: string;
  stadiumName: string;
  matchDate: string;
  ticketCategoryName: string;
  ticketPrice: number;
  sectionNumber: number;
  userId: number | null;
  userEmail: string | null;
  paymentId: number | null;
  paymentStatus: string | null;
  paymentAmount: number | null;
}
