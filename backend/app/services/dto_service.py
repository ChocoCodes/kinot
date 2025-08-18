from ..models import Goal
from ..utils import format_image_path

class ActiveGoalDTO:
    id: int
    required_amount: float
    current_amount: float
    title: str
    image_path: str

    def __init__(self, goal: Goal):
        self.id = goal.id
        self.required_amount = goal.required_amount
        self.current_amount = goal.current_amount
        self.title = goal.title
        self.image_path = format_image_path(goal.image_path, 'goals')
