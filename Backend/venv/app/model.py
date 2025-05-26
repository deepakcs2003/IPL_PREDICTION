from pydantic import BaseModel
class MatchData(BaseModel):
    batting_team: str
    bowling_team: str
    city: str
    run_left: int
    balls_left: int
    wickets: int
    total_runs_x: int
    crr: float
    rrr: float