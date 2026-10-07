/**
 * Estimates calories burned based on activity type, duration, and user weight.
 * Formula: Calories = MET * weight (kg) * duration (hours)
 * MET values:
 * - Walking: ~3.5 MET
 * - Running: ~8.0 MET
 * - Cycling: ~6.0 MET
 *
 * @param {string} activityType Walking | Running | Cycling
 * @param {number} durationSeconds Duration in seconds
 * @param {number} weightKg User weight in kilograms (default 70kg)
 * @returns {number} Estimated calories burned
 */
export const calculateCalories = (activityType, durationSeconds, weightKg = 70) => {
  const metValues = {
    Walking: 3.5,
    Running: 8.0,
    Cycling: 6.0,
  };

  const met = metValues[activityType] || 3.5;
  const durationHours = durationSeconds / 3600;

  const calories = met * weightKg * durationHours;
  return Math.round(calories);
};
