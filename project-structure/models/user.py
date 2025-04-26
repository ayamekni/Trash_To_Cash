from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from utils.db import get_db
from bson import ObjectId
import datetime

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data.get('_id'))
        self.username = user_data.get('username')
        self.email = user_data.get('email')
        self.password_hash = user_data.get('password_hash')
        self.created_at = user_data.get('created_at')
        self.predictions = user_data.get('predictions', [])
    
    def get_id(self):
        return self.id
    
    @staticmethod
    def register(username, email, password):
        db = get_db()
        
        # Create user document
        user_id = db.users.insert_one({
            'username': username,
            'email': email,
            'password_hash': generate_password_hash(password),
            'created_at': datetime.datetime.utcnow(),
            'predictions': []
        }).inserted_id
        
        return str(user_id)
    
    @staticmethod
    def authenticate(email, password):
        db = get_db()
        user_data = db.users.find_one({'email': email})
        
        if user_data and check_password_hash(user_data['password_hash'], password):
            return User(user_data)
        
        return None
    
    def add_prediction(self, prediction_id):
        db = get_db()
        db.users.update_one(
            {'_id': ObjectId(self.id)},
            {'$push': {'predictions': prediction_id}}
        )
        self.predictions.append(prediction_id)