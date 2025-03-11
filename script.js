function calculatePension() {
  // Tier II Constants (2025 Dollars)
  const INITIAL_CAP = 127283.01; // 2025 cap
  const CAP_GROWTH_RATE = -0.0125; // -1.25% annual real growth
  const MULTIPLIER = 0.022; // 2.2% per year of service
  const FULL_RETIREMENT_AGE = 67;
  const EARLY_PENALTY_PER_YEAR = 0.06; // 6% penalty per year below 67

  // Get Inputs
  const finalAvgSalary = parseFloat(document.getElementById('finalAvgSalary').value);
  const yearsOfService = parseFloat(document.getElementById('yearsOfService').value);
  const currentAge = parseFloat(document.getElementById('currentAge').value);
  const retirementAge = parseFloat(document.getElementById('retirementAge').value);

  // Validate
  if ([finalAvgSalary, yearsOfService, currentAge, retirementAge].some(isNaN)) {
    alert("Please fill all fields with valid numbers.");
    return;
  }

  // Calculate Years Until Retirement
  const yearsUntilRetirement = retirementAge - currentAge;
  const retirementYear = 2025 + yearsUntilRetirement;

  // Adjust Cap for 2025 Dollars
  const yearsFrom2025 = retirementYear - 2025;
  const adjustedCap = INITIAL_CAP * Math.pow(1 + CAP_GROWTH_RATE, yearsFrom2025);

  // Apply Cap to Salary
  const cappedSalary = Math.min(finalAvgSalary, adjustedCap);

  // Calculate Base Pension
  let annualPension = MULTIPLIER * yearsOfService * cappedSalary;

  // Early Retirement Penalty
  if (retirementAge < FULL_RETIREMENT_AGE) {
    const penaltyYears = FULL_RETIREMENT_AGE - retirementAge;
    annualPension *= Math.pow(1 - EARLY_PENALTY_PER_YEAR, penaltyYears);
  }

  // Monthly Pension
  const monthlyPension = annualPension / 12;

  // Display Results
  document.getElementById('monthlyAmount').textContent = `$${monthlyPension.toFixed(2)}`;

  // Projected Payments at Specific Ages
  const ages = [62, 65, 67, 75, 85];
  ages.forEach(age => {
    const yearsFromRetirement = age - retirementAge;
    const projectedCap = adjustedCap * Math.pow(1 + CAP_GROWTH_RATE, yearsFromRetirement);
    const projectedSalary = Math.min(finalAvgSalary, projectedCap);
    let projectedPension = MULTIPLIER * yearsOfService * projectedSalary;

    // Apply early penalty if applicable
    if (age < FULL_RETIREMENT_AGE) {
      const penaltyYears = FULL_RETIREMENT_AGE - age;
      projectedPension *= Math.pow(1 - EARLY_PENALTY_PER_YEAR, penaltyYears);
    }

    const projectedMonthly = projectedPension / 12;
    document.getElementById(`age${age}`).textContent = `$${projectedMonthly.toFixed(2)}`;
  });
}
