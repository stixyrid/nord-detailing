export type BookingRequest = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  date: string;
  message: string;
};
/** Integration boundary: replace this function with an explicitly configured delivery service. */
export async function previewBooking(
  _request: BookingRequest,
): Promise<{ mode: "demo"; submitted: false }> {
  return { mode: "demo", submitted: false };
}
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
