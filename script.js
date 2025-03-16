function calculatePension() {
  // Tier II Constants (2025 Dollars)
  const INITIAL_CAP = 127283.01; // 2025 cap
  const CAP_GROWTH_RATE = -0.0125; // -1.25% annual real growth
  const MULTIPLIER = 0.022; // 2.2% per year of service
  const FULL_RETIREMENT_AGE = 67;
  const EARLY_PENALTY_PER_YEAR = 0.06; // 6% penalty per year below 67
  const MAX_YEARS_SERVICE = 35; // Maximum years of service
  const MIN_YEARS_SERVICE = 10; // Minimum years of service
  const MULTIPLIER_CAP = 0.75; // 75% cap on the multiplier

  // Get Inputs
  const finalAvgSalary = parseFloat(document.getElementById('finalAvgSalary').value);
  const yearsOfService = parseFloat(document.getElementById('yearsOfService').value);
  const currentAge = parseFloat(document.getElementById('currentAge').value);
  const pensionCollectionAge = parseFloat(document.getElementById('pensionCollectionAge').value);

  // Validate inputs
  if ([finalAvgSalary, yearsOfService, currentAge, pensionCollectionAge].some(isNaN)) {
    alert("Please fill all fields with valid numbers.");
    return;
  }

  // Validate years of service
  if (yearsOfService < MIN_YEARS_SERVICE) {
    alert("10 years of service credit is the minimum needed to receive a pension benefit.");
    return;
  }

  // Validate pension collection age
  if (pensionCollectionAge < 62 || pensionCollectionAge > 67) {
    alert("Pension collection cannot occur under the age of 62 and is maximized at the age of 67.");
    return;
  }

  // Clamp years of service to maximum
  const clampedYearsOfService = Math.min(yearsOfService, MAX_YEARS_SERVICE);

  // Calculate Years Until Pension Collection
  const yearsUntilCollection = pensionCollectionAge - currentAge;
  const collectionYear = 2025 + yearsUntilCollection;

  // Adjust Cap for 2025 Dollars
  const yearsFrom2025 = collectionYear - 2025;
  const adjustedCap = INITIAL_CAP * Math.pow(1 + CAP_GROWTH_RATE, yearsFrom2025);

  // Apply Cap to Salary
  const cappedSalary = Math.min(finalAvgSalary, adjustedCap);

  // Calculate Base Pension
  let pensionPercentage = MULTIPLIER * clampedYearsOfService; // 2.2% per year
  pensionPercentage = Math.min(pensionPercentage, MULTIPLIER_CAP); // Cap at 75%
  let annualPension = pensionPercentage * cappedSalary;

  // Apply Early Retirement Penalty
  if (pensionCollectionAge < FULL_RETIREMENT_AGE) {
    const penaltyYears = FULL_RETIREMENT_AGE - pensionCollectionAge;
    annualPension *= Math.pow(1 - EARLY_PENALTY_PER_YEAR, penaltyYears);
  }

  // Calculate Monthly Pension
  const monthlyPension = annualPension / 12;

  // Display Results
  document.getElementById('monthlyAmount').textContent = `$${monthlyPension.toFixed(2)}`;

  // Projected Payments at Specific Ages
  const ages = [62, 65, 67, 75, 85];
  ages.forEach(age => {
    const yearsFromCollection = age - pensionCollectionAge;
    const projectedCap = adjustedCap * Math.pow(1 + CAP_GROWTH_RATE, yearsFromCollection);
    const projectedSalary = Math.min(finalAvgSalary, projectedCap);
    let projectedPension = pensionPercentage * projectedSalary;

    // Apply early penalty if applicable
    if (age < FULL_RETIREMENT_AGE) {
      const penaltyYears = FULL_RETIREMENT_AGE - age;
      projectedPension *= Math.pow(1 - EARLY_PENALTY_PER_YEAR, penaltyYears);
    }

    const projectedMonthly = projectedPension / 12;
    document.getElementById(`age${age}`).textContent = `$${projectedMonthly.toFixed(2)}`;
  });
}
