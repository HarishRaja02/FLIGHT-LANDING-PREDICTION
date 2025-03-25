// Synthetic trained coefficients (adjust based on your actual model)
const modelCoefficients = {
    intercept: 0, // Update this if your model has an intercept
    Distance: 0.125,
    DepDelay: 1.02,
    TaxiOut: 1.1,
    TaxiIn: 1.15
};

// Convert HHMM to minutes since midnight
function convertHHMMtoMinutes(hhmm) {
    hhmm = parseInt(hhmm);
    const hours = Math.floor(hhmm / 100);
    const minutes = hhmm % 100;
    return hours * 60 + minutes;
}

// Convert total minutes to HH:MM format
function convertMinutesToHHMM(minutes) {
    minutes = Math.round(minutes) % (24 * 60); // rounding & wrap around 24h
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}


// Predict landing time function
function predictLandingTime(dep_time, distance_miles, dep_delay, taxi_out, taxi_in) {
    const predictedElapsedTime =
        modelCoefficients.intercept +
        modelCoefficients.Distance * distance_miles +
        modelCoefficients.DepDelay * dep_delay +
        modelCoefficients.TaxiOut * taxi_out +
        modelCoefficients.TaxiIn * taxi_in;

    const depTimeMin = convertHHMMtoMinutes(dep_time);
    const estimatedLandingMin = depTimeMin + predictedElapsedTime;
    return convertMinutesToHHMM(estimatedLandingMin);
}

// Form submit handler
document.getElementById('predictForm').addEventListener('submit', function (e) {
    e.preventDefault(); // prevent form refresh

    const dep_time = document.getElementById('dep_time').value;
    const distance_km = parseFloat(document.getElementById('distance').value);
    const dep_delay = parseFloat(document.getElementById('dep_delay').value);
    const taxi_out = parseFloat(document.getElementById('taxi_out').value);
    const taxi_in = parseFloat(document.getElementById('taxi_in').value);

    if (!dep_time || isNaN(distance_km) || isNaN(dep_delay) || isNaN(taxi_out) || isNaN(taxi_in)) {
        document.getElementById('result').innerText = "Please fill all fields correctly.";
        return;
    }

    const distance_miles = distance_km / 1.60934; // Convert km to miles
    const landingTime = predictLandingTime(dep_time, distance_miles, dep_delay, taxi_out, taxi_in);

    document.getElementById('result').innerText = `Estimated Landing Time: ${landingTime}`;
});
