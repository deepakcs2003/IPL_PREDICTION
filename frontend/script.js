let currentFormData = {};

document.getElementById('cricketForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading
    document.getElementById('loading').classList.add('show');
    document.getElementById('resultsSection').classList.remove('show');

    // Get form data
    const formData = new FormData(this);
    const currentRuns = parseInt(formData.get('currentRuns'));
    const totalTarget = parseInt(formData.get('totalTarget'));
    const currentOver = parseFloat(formData.get('currentOver'));
    const wicketsDown = parseInt(formData.get('wicketsDown'));

    // Store form data
    currentFormData = {
        battingTeam: formData.get('battingTeam'),
        bowlingTeam: formData.get('bowlingTeam'),
        city: formData.get('city'),
        currentRuns: currentRuns,
        totalTarget: totalTarget,
        currentOver: currentOver,
        wicketsDown: wicketsDown
    };

    // Calculate prediction data
    const runLeft = totalTarget - currentRuns;
    const ballsLeft = (20 - currentOver) * 6;
    const crr = currentOver > 0 ? (currentRuns / currentOver).toFixed(2) : 0;
    const rrr = ballsLeft > 0 ? ((runLeft / ballsLeft) * 6).toFixed(2) : 0;

    const predictionData = {
        batting_team: formData.get('battingTeam'),
        bowling_team: formData.get('bowlingTeam'),
        city: formData.get('city'),
        run_left: runLeft,
        balls_left: Math.round(ballsLeft),
        wickets: wicketsDown,
        total_runs_x: totalTarget,
        crr: parseFloat(crr),
        rrr: parseFloat(rrr)
    };

    // Simulate API call with delay
    setTimeout(() => {
        makePrediction(predictionData);
    }, 2000);
});

async function makePrediction(predictionData) {
    try {
        console.log('Prediction data:', predictionData);

        // Uncomment for real API call
        // const response = await fetch('http://127.0.0.1:8000/predict', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(predictionData)
        // });
        // const result = await response.json();

        // Sample prediction result for demo
        const result = {
            win: Math.random() * 100,
            lose: Math.random() * 100
        };

        // Normalize percentages to sum to 100
        const total = result.win + result.lose;
        result.win = (result.win / total) * 100;
        result.lose = (result.lose / total) * 100;

        displayResults(result);

    } catch (error) {
        console.error('Prediction error:', error);
        
        // Fallback result
        const result = {
            win: 45.5,
            lose: 54.5
        };
        displayResults(result);
    } finally {
        document.getElementById('loading').classList.remove('show');
    }
}

function displayResults(result) {
    // Update match details
    const matchDetailsHTML = `
        <div class="detail-card">
            <div class="detail-label">Batting Team</div>
            <div class="detail-value">${currentFormData.battingTeam}</div>
        </div>
        <div class="detail-card">
            <div class="detail-label">Bowling Team</div>
            <div class="detail-value">${currentFormData.bowlingTeam}</div>
        </div>
        <div class="detail-card">
            <div class="detail-label">Target</div>
            <div class="detail-value">${currentFormData.totalTarget}</div>
        </div>
        <div class="detail-card">
            <div class="detail-label">Current Score</div>
            <div class="detail-value">${currentFormData.currentRuns}/${currentFormData.wicketsDown}</div>
        </div>
    `;
    document.getElementById('matchDetails').innerHTML = matchDetailsHTML;

    // Update percentages
    const winPercentage = Math.round(result.win * 10) / 10;
    const losePercentage = Math.round(result.lose * 10) / 10;

    document.getElementById('winPercentage').textContent = winPercentage.toFixed(1) + '%';
    document.getElementById('losePercentage').textContent = losePercentage.toFixed(1) + '%';

    // Animate bars
    setTimeout(() => {
        document.getElementById('winBar').style.width = winPercentage + '%';
        document.getElementById('loseBar').style.width = losePercentage + '%';
    }, 300);

    // Update summary
    const isWinning = winPercentage > losePercentage;
    const winningTeam = isWinning ? currentFormData.battingTeam : currentFormData.bowlingTeam;
    const confidence = Math.max(winPercentage, losePercentage);

    document.getElementById('winningTeam').textContent = 
        `${winningTeam} likely to ${isWinning ? 'WIN' : 'WIN'}`;
    document.getElementById('confidenceLevel').textContent = 
        `Confidence Level: ${confidence.toFixed(1)}%`;

    // Show results
    document.getElementById('resultsSection').classList.add('show');
}

function resetForm() {
    document.getElementById('cricketForm').reset();
    document.getElementById('resultsSection').classList.remove('show');
    document.getElementById('winBar').style.width = '0%';
    document.getElementById('loseBar').style.width = '0%';
}

// Prevent selecting same team for batting and bowling
document.getElementById('battingTeam').addEventListener('change', function() {
    const bowlingSelect = document.getElementById('bowlingTeam');
    const selectedValue = this.value;
    
    Array.from(bowlingSelect.options).forEach(option => {
        option.disabled = option.value === selectedValue && option.value !== '';
    });
});

document.getElementById('bowlingTeam').addEventListener('change', function() {
    const battingSelect = document.getElementById('battingTeam');
    const selectedValue = this.value;
    
    Array.from(battingSelect.options).forEach(option => {
        option.disabled = option.value === selectedValue && option.value !== '';
    });
});