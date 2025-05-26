import pickle
import numpy as np
import pandas as pd
from app.model import MatchData
from pathlib import Path

# Adjust path to your actual model location
model_path = Path(__file__).parent.parent / "models" / "ipl_model.pkl"
with open(model_path, 'rb') as file:
    model = pickle.load(file)


def predict_outcome(data: MatchData):
    input_df = pd.DataFrame([{
        "batting_team": data.batting_team,
        "bowling_team": data.bowling_team,
        "city": data.city,
        "run_left": data.run_left,
        "balls_left": data.balls_left,
        "wickets": data.wickets,
        "total_runs_x": data.total_runs_x,
        "crr": data.crr,
        "rrr": data.rrr
    }])
    print("Input DataFrame for prediction:", input_df)
    probs = model.predict_proba(input_df)
    return {
        "lose": probs[0][0] * 100,
        "win": probs[0][1] * 100
    }
