import os
from flask import Flask, jsonify
from flask_cors import CORS
from backend.algorithms import algorithms_bp

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(algorithms_bp, url_prefix="/api")

@app.route('/', methods=['GET'])
def initial():
     return jsonify({"message": "Flask App running smoothly..."}), 201

if __name__ == '__main__':
     port = int(os.environ.get("PORT", 5000))
     app.run(debug=True, host='0.0.0.0', port=port)