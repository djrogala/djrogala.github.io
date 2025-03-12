document.getElementById('pensionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const finalSalary = parseFloat(document.getElementById('finalSalary').value);
    const currentAge = parseFloat(document.getElementById('currentAge').value);
    const serviceYears = parseFloat(document.getElementById('serviceYears').value);
    const collectionAge = parseFloat(document.getElementById('collectionAge').value);

    const yearsToInflation = collectionAge - currentAge;
    const averageFinalSalaryAfterInflation = finalSalary * Math.pow(1.025, yearsToInflation);
    const pensionCapAfterInflation = 127283.01 * Math.pow(1.0125, yearsToInflation);
    const salaryUsedForPension = Math.min(averageFinalSalaryAfterInflation, pensionCapAfterInflation);
    const pensionFormula = serviceYears * 2.2;
    const pensionPercentage = Math.min(pensionFormula, 75);
    const benefitReduction = (67 - collectionAge) * 0.06;
    const finalPensionPercentage = pensionPercentage * (1 - benefitReduction);
    const pensionFutureDollars = salaryUsedForPension * (finalPensionPercentage / 100);
    const pensionTodayDollars = pensionFutureDollars * (Math.pow(1.0125, yearsToInflation) / Math.pow(1.025, yearsToInflation));

    document.getElementById('pensionValue').textContent = pensionTodayDollars.toFixed(2);

    // Calculate pension at different ages
    const pensionTable = document.getElementById('pensionTable').getElementsByTagName('tbody')[0];
    pensionTable.innerHTML = ''; // Clear previous results

    for (let age = 62; age <= 67; age++) {
        const yearsToInflationAge = age - currentAge;
        const averageFinalSalaryAfterInflationAge = finalSalary * Math.pow(1.025, yearsToInflationAge);
        const pensionCapAfterInflationAge = 127283.01 * Math.pow(1.0125, yearsToInflationAge);
        const salaryUsedForPensionAge = Math.min(averageFinalSalaryAfterInflationAge, pensionCapAfterInflationAge);
        const pensionFormulaAge = serviceYears * 2.2;
        const pensionPercentageAge = Math.min(pensionFormulaAge, 75);
        const benefitReductionAge = (67 - age) * 0.06;
        const finalPensionPercentageAge = pensionPercentageAge * (1 - benefitReductionAge);
        const pensionFutureDollarsAge = salaryUsedForPensionAge * (finalPensionPercentageAge / 100);
        const pensionTodayDollarsAge = pensionFutureDollarsAge * (Math.pow(1.0125, yearsToInflationAge) / Math.pow(1.025, yearsToInflationAge));

        const row = pensionTable.insertRow();
        const cellAge = row.insertCell(0);
        const cellPension = row.insertCell(1);
        cellAge.textContent = age;
        cellPension.textContent = pensionTodayDollarsAge.toFixed(2);
    }
});
