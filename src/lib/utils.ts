import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const options: any = { year: "numeric", month: "short", day: "numeric" };
  const datePart = date.toLocaleDateString("en-US", options);

  const timeOptions: any = { hour: "2-digit", minute: "2-digit", hour12: true };
  const timePart = date.toLocaleTimeString("en-US", timeOptions).toLowerCase();

  return `${datePart} | ${timePart}`;
}

export function formatDateToYYYYMMDD(date: any) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
