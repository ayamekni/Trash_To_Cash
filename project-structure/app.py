import os
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from models.user import User
from models.prediction import Prediction
from utils.db import get_db
from utils.ai_integration import predict_recyclability
import config

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config.from_object(config.Config)

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    db = get_db()
    user_data = db.users.find_one({"_id": user_id})
    if user_data:
        return User(user_data)
    return None

# Routes
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    return render_template('auth/login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        db = get_db()
        
        # Check if user already exists
        if db.users.find_one({"email": email}):
            flash('Email already registered', 'error')
            return render_template('auth/register.html')
        
        # Create new user
        user_id = User.register(username, email, password)
        
        if user_id:
            # Log in the user
            user_data = db.users.find_one({"_id": user_id})
            user = User(user_data)
            login_user(user)
            flash('Registration successful!', 'success')
            return redirect(url_for('home'))
        
        flash('Registration failed', 'error')
    
    return render_template('auth/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = User.authenticate(email, password)
        
        if user:
            login_user(user)
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        
        flash('Invalid email or password', 'error')
    
    return render_template('auth/login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))

@app.route('/home')
@login_required
def home():
    return render_template('home.html')

@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'image' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)
        
        file = request.files['image']
        
        # If user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
        
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Call AI model for prediction
            result = predict_recyclability(filepath)
            
            # Save prediction to database
            prediction_id = Prediction.create(
                user_id=current_user.id,
                image_path=filepath,
                result=result
            )
            
            # Store prediction ID in session for result page
            session['prediction_id'] = str(prediction_id)
            
            return redirect(url_for('result'))
    
    return render_template('upload.html')

@app.route('/result')
@login_required
def result():
    prediction_id = session.get('prediction_id')
    if not prediction_id:
        flash('No prediction found', 'error')
        return redirect(url_for('upload'))
    
    db = get_db()
    prediction_data = db.predictions.find_one({"_id": prediction_id})
    
    if not prediction_data:
        flash('Prediction not found', 'error')
        return redirect(url_for('upload'))
    
    prediction = Prediction(prediction_data)
    
    return render_template('result.html', prediction=prediction)

@app.route('/api/predictions', methods=['GET'])
@login_required
def get_predictions():
    db = get_db()
    predictions = list(db.predictions.find({"user_id": current_user.id}))
    return jsonify([Prediction(p).to_dict() for p in predictions])

if __name__ == '__main__':
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)