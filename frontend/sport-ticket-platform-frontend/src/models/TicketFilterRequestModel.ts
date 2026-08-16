export interface TicketFilterRequestModel {
  ticketId: string | null;
  ticketType: string | null;
  sportType: string | null;
  startDate: string | null;
  endDate: string | null;
  minPrice: string | null;
  maxPrice: string | null;
}

export const emptyTicketFilter: TicketFilterRequestModel = {
  ticketId: null,
  ticketType: null,
  sportType: null,
  startDate: null,
  endDate: null,
  minPrice: null,
  maxPrice: null,
};
