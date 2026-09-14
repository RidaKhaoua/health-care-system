export function formatNumber(amount: number): string {
  return amount?.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export function generateRandomColor(): string {
  let hexColor = "";
  do {
    const randomInt = Math.floor(Math.random() * 16777216);

    hexColor = `#${randomInt.toString(16).padStart(6, "0")}`;
  } while (
    hexColor.toLowerCase() === "#ffffff" ||
    hexColor.toLowerCase() === "#000000"
  ); // Ensure it’s not white or black
  return hexColor;
}

// Generates times like "9:00", "9:30", "10:00" ... every 30 min from 8:00 to 20:00
export function generateTimes(startHour = 8, endHour = 18, stepMinutes = 30) {
  const times = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) break;
      const hh = h.toString();
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
}