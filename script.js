function calculatePension() {
  // Tier II Constants (2025 Dollars)
  const INITIAL_CAP = 127283.01; 
  const CAP_GROWTH_RATE = -0.0125; 
  const MULTIPLIER = 0.022; 
  const FULL_RETIREMENT_AGE = 67;
  const EARLY_PENALTY_PER_YEAR = 0.06; 
  const MAX_YEARS_SERVICE = 35; 
  const MIN_YEARS_SERVICE = 10; 
  const MULTIPLIER_CAP = 0.75; 

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

  // Validate service years and age
  if (yearsOfService < MIN_YEARS_SERVICE) {
    alert("10 years of service credit is the minimum needed.");
    return;
  }
  if (pensionCollectionAge < 62 || pensionCollectionAge > 67) {
    alert("Pension collection must be between ages 62-67.");
    return;
  }

  // Clamp service years
  const clampedYearsOfService = Math.min(yearsOfService, MAX_YEARS_SERVICE);

  // Calculate years until collection
  const yearsUntilCollection = pensionCollectionAge - currentAge;
  const collectionYear = 2025 + yearsUntilCollection;

  // Adjust cap for inflation
  const yearsFrom2025 = collectionYear - 2025;
  const adjustedCap = INITIAL_CAP * Math.pow(1 + CAP_GROWTH_RATE, yearsFrom2025);

  // Apply salary cap
  const cappedSalary = Math.min(finalAvgSalary, adjustedCap);

  // Calculate base pension
  let pensionPercentage = MULTIPLIER * clampedYearsOfService;
  pensionPercentage = Math.min(pensionPercentage, MULTIPLIER_CAP);
  let annualPension = pensionPercentage * cappedSalary;

  // Apply permanent penalty if collected early
  if (pensionCollectionAge < FULL_RETIREMENT_AGE) {
    const penaltyYears = FULL_RETIREMENT_AGE - pensionCollectionAge;
    annualPension *= Math.pow(1 - EARLY_PENALTY_PER_YEAR, penaltyYears);
  }

  // Monthly pension
  const monthlyPension = annualPension / 12;
  document.getElementById('monthlyAmount').textContent = `$${monthlyPension.toFixed(2)}`;

  // Projected payments
  const ages = [62, 65, 67, 75, 85];
  ages.forEach(age => {
    const yearsFromCollection = age - pensionCollectionAge;
    const projectedCap = adjustedCap * Math.pow(1 + CAP_GROWTH_RATE, yearsFromCollection);
    const projectedSalary = Math.min(finalAvgSalary, projectedCap);
    let projectedPension = pensionPercentage * projectedSalary;

    // Inherit penalty if collection was early
    if (pensionCollectionAge < FULL_RETIREMENT_AGE) {
      const penaltyYears = FULL_RETIREMENT_AGE - pensionCollectionAge;
      projectedPension *= Math.pow(1 - EARLY_PENALTY_PER_YEAR, penaltyYears);
    }

    const projectedMonthly = projectedPension / 12;
    document.getElementById(`age${age}`).textContent = `$${projectedMonthly.toFixed(2)}`;
  });
}
