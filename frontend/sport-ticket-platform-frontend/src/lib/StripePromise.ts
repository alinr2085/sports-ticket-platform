import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51TqB8xJcNHCrTmKew8gxsi5J2ZDmUOvWVRBhczRvJdKHn3NSMFC5X1F9cGtj6J7YuzUkaUqMRQMykcuxfX3vZ7gc00RBkARQOa",
);
