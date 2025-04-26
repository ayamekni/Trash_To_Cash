from utils.db import get_db
from bson import ObjectId
import datetime

class Prediction:
    def __init__(self, prediction_data):
        self.id = str(prediction_data.get('_id'))
        self.user_id = prediction_data.get('user_id')
        self.image_path = prediction_data.get('image_path')
        self.result = prediction_data.get('result')
        self.recyclable = prediction_data.get('recyclable')
        self.confidence = prediction_data.get('confidence')
        self.created_at = prediction_data.get('created_at')
    
    def to_dict(self):
        return {
            'id': self.id,
            'image_path': self.image_path,
            'result': self.result,
            'recyclable': self.recyclable,
            'confidence': self.confidence,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @staticmethod
    def create(user_id, image_path, result):
        db = get_db()
        
        # Extract data from AI model result
        recyclable = result.get('recyclable', False)
        confidence = result.get('confidence', 0.0)
        
        # Create prediction document
        prediction_id = db.predictions.insert_one({
            'user_id': user_id,
            'image_path': image_path,
            'result': result,
            'recyclable': recyclable,
            'confidence': confidence,
            'created_at': datetime.datetime.utcnow()
        }).inserted_id
        
        # Update user's predictions
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'predictions': str(prediction_id)}}
        )
        
        return prediction_id
    
    @staticmethod
    def get_by_id(prediction_id):
        db = get_db()
        prediction_data = db.predictions.find_one({'_id': ObjectId(prediction_id)})
        if prediction_data:
            return Prediction(prediction_data)
        return None