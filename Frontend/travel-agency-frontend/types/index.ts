export interface Tour {
  id: number;
  title: string;
  slug: string;
  description: string;
  contentHtml: string;
  price: number;
  imageUrl: string;
  duration: string;
  location: string;
  metaTitle: string;
  metaDescription: string;
}

export interface BookingInput {
  tourId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfPeople: number;
  travelDate: string;
  notes: string;
}