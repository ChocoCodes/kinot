import os
from app import db
from .utils import generate_salt, generate_hash, isoformat_utc
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    _secret_answer_hashed = db.Column(db.String(150), nullable=False)
    _password_hashed = db.Column(db.String(128), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_salt = db.Column(db.LargeBinary(16), nullable=False)
    secret_question = db.Column(db.String(150), nullable=False)
    secret_answer_salt = db.Column(db.LargeBinary(16), nullable=False)
    profile_path = db.Column(db.String(255), nullable=False, default='default.jpg')

    monthly_finances = db.relationship('MonthlyFinance', back_populates='user', cascade='all, delete-orphan') # Establish 1:M relationship with MonthlyFinances
    transactions = db.relationship('Transaction', back_populates='user', cascade='all, delete-orphan', lazy='dynamic') # Establish 1:M relationship with Transactions
    goals = db.relationship('Goal', back_populates='user', cascade='all, delete-orphan', lazy='dynamic') # Establish 1:M relationship with Goals

    def __init__(
        self, 
        fullname: str, 
        username: str, 
        raw_password: str, 
        secret_question: str, 
        raw_secret_answer: str
    ) -> None:
        self.fullname = fullname
        self.username = username
        self.password_hashed = raw_password
        self.secret_question = secret_question
        self.secret_answer_hashed = raw_secret_answer

    def __repr__(self):
        return f"<Username: {self.username}, Full Name: {self.fullname}, Secret Question: {self.secret_question}>"
    
    @property
    def password_hashed(self):
        """ AttributeError will be called if password_hashed is None. """
        raise AttributeError("password_hashed field is read-only.")
    
    @password_hashed.setter
    def password_hashed(self, raw_password: str) -> None:
        """ Automatically generate salt and hash the password. """
        self.password_salt = generate_salt()
        self._password_hashed = generate_hash(raw_password, self.password_salt)

    @property
    def secret_answer_hashed(self):
        """ AttributeError will be called if secret_answer_hashed is None. """
        raise AttributeError("secret_answer_hashed field is read-only.")
    
    @secret_answer_hashed.setter
    def secret_answer_hashed(self, raw_secret_answer: str) -> None:
        self.secret_answer_salt = generate_salt()
        self._secret_answer_hashed = generate_hash(raw_secret_answer, self.secret_answer_salt)
    
    def to_dict(self) -> dict:
        """ Convert User instance into a dictionary representation """
        return {
            "id": self.id,
            "username": self.username,
            "fullname": self.fullname,
            "secret_question": self.secret_question
        }
    
    def validate_password(self, input_pass: str) -> bool:
        hashed_input = generate_hash(input_pass, self.password_salt)
        return hashed_input == self._password_hashed


class MonthlyFinance(db.Model):
    __tablename__ = "MonthlyFinances"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    savings = db.Column(db.Float, default=0.0)
    spendings = db.Column(db.Float, default=0.0)
    allowance = db.Column(db.Float, default=0.0)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'year', 'month', name='unique_user_month'),
    )

    user = db.relationship('User', back_populates='monthly_finances') # Establish M:1 relationship with Users

    def __init__(self, **kwargs):
        # Set the date before extracting the month and year
        if 'date' not in kwargs or kwargs['date'] is None:
            kwargs['date'] = datetime.now(timezone.utc)
        super().__init__(**kwargs)
        if self.date:
            self.year = self.date.year
            self.month = self.date.month

    def __repr__(self):
        return f"""
        <
            UserID: {self.user_id}, 
            Date: {self.date}, 
            Savings: {self.savings},
            Spendings: {self.spendings},
            Year: {self.year},
            Month: {self.month},
            Allowance: {self.allowance},
        >
        """
    
    def to_dict(self) -> dict:
        return{
            "id": self.id,
            "user_id": self.user_id,
            "date": isoformat_utc(self.date),
            "savings": self.savings,
            "year": self.year,
            "month": self.month,
            "spendings": self.spendings,
            "allowance": self.allowance
        }


class Transaction(db.Model):
    __tablename__ = "Transactions"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, default=0.0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    method = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(100))
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship('User', back_populates='transactions') # Establish M:1 relationship with User

    def delete(self) -> None:
        self.is_deleted = True

    def __repr__(self): 
        return f"""
        <
            TransactionID: {self.id},
            UserID: {self.user_id},
            Category: {self.category},
            Amount: {self.amount},
            CreatedAt: {self.created_at},
            Method: {self.method},
            Description {"No Description" if not self.description else self.description}
        >
        """
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category": self.category,
            "amount": self.amount,
            "created_at": f"{self.created_at.isoformat()}Z",
            "method": self.method,
            "description": "" if not self.description else self.description
        }


class Goal(db.Model):
    __tablename__ = "Goals"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    title = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    required_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, nullable=False, default=0.0)
    is_deleted = db.Column(db.Boolean, default=False, nullable=False)
    image_path = db.Column(db.String(255), nullable=False, default='default-goal.jpg')

    user = db.relationship("User", back_populates='goals') # Establish M:1 relationship with User
    goal_contributions = db.relationship("GoalContribution", back_populates='goal', cascade="all, delete-orphan")

    def update_current_amount(self, amount: float) -> None:
        self.current_amount = self.current_amount + amount
    
    def delete(self) -> None:
        self.is_deleted = True
    
    def __repr__(self):
        return f"""
        <
            GoalID: {self.id},
            UserID: {self.user_id},
            Title: {self.title},
            Description: {"No description" if not self.description else self.description},
            CreatedAt: {self.created_at},
            RequiredAmount: {self.required_amount},
            CurrentAmount: {self.current_amount},
        >
        """

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": "" if not self.description else self.description,
            "created_at": f"{self.created_at.isoformat()}Z",
            "required_amount": self.required_amount,
            "current_amount": self.current_amount,
        }


class GoalContribution(db.Model):
    __tablename__ = "GoalContributions"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('Goals.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    goal = db.relationship("Goal", back_populates="goal_contributions")

    def __repr__(self):
        return f"<GoalID: {self.goal_id}, Amount: {self.amount}, AddedAt: {self.added_at}>"
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "goal_id": self.goal_id,
            "amount": self.amount,
            "added_at": self.added_at
        }