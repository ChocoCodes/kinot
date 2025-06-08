import os
from app import db
from utils import generate_salt, generate_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'Users'

    _id = db.Column(db.Integer, primary_key=True, nullable=False)
    _secret_answer_hashed = db.Column(db.String(150), nullable=False)
    _password_hashed = db.Column(db.String(128), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_salt = db.Column(db.LargeBinary(16), nullable=False)
    secret_question = db.Column(db.String(150), nullable=False)
    secret_answer_salt = db.Column(db.LargeBinary(16), nullable=False)

    # Establish a one-to-many relationship with MonthlyFinance
    monthly_finances = db.relationship('MonthlyFinance', back_populates='user', cascade='all, delete-orphan')

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
            "user_id": self._id,
            "username": self.username,
            "fullname": self.fullname,
            "secret_question": self.secret_question
        }
    
    def validate_password(self, input_pass: str) -> bool:
        hashed_input = generate_hash(input_pass, self.password_salt)
        return hashed_input == self._password_hashed


class MonthlyFinance(db.Model):
    __tablename__ = "MonthlyFinances"

    _id = db.Column(db.Integer, primary_key=True, nullable=False)
    _user_id = db.Column(db.Integer, db.ForeignKey('Users._id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    savings = db.Column(db.Float, default=0.0)
    spendings = db.Column(db.Float, default=0.0)
    allowance = db.Column(db.Float, default=0.0)

    # Establish a many-to-one relationship with Users
    user = db.relationship('User', back_populates='monthly_finances')

    def __repr__(self):
        return f"""
        <
            UserID: {self._user_id}, 
            Date: {self.date}, 
            Savings: {self.savings},
            Spendings: {self.spendings},
            Allowance: {self.allowance}
        >
        """
    
    def to_dict(self) -> dict:
        return{
            "monthly_finance_id": self._id,
            "user_id": self._user_id,
            "date": f"{self.date.isoformat()}Z",
            "savings": self.savings,
            "spendings": self.spendings,
            "allowance": self.allowance
        }