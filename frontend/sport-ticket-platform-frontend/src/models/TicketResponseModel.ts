export interface TicketResponseModel {
  ticketId: number;
  userId: number;
  sectionNumber: number;
  sportName: string;
  homeTeamName: string;
  awayTeamName: string;
  stadiumName: string;
  cityName: string;
  matchDate: string;
  status: string;
  ticketCategoryName: string;
  price: number;
  remainingCapacity: number;
}
