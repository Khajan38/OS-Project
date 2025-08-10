import os
from flask import Flask, jsonify #Flask library is used to create the web application and jsonify is used to convert Python objects to JSON format.
from flask_cors import CORS #CORS is used to handle Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend which are running in different ports.

app = Flask(__name__) # Create a Flask application instance
app.config['JSON_SORT_KEYS'] = False # Disable sorting of JSON keys in the response
CORS(app, resources={r"/*": {"origins": "*"}}) # Enable CORS for all routes under /api/*

@app.route('/', methods=['GET'])
def initial():
     return jsonify({"message": "Initial state user_name = None"}), 201

if __name__ == '__main__': #Runs when the script is executed directly
     port = int(os.environ.get("PORT", 5000)) # Get the port from environment variable or default to 5000
     app.run(debug=True, host='0.0.0.0', port=port) # Start the Flask application with debug mode enabled, accessible from any IP address on the specified port
# This allows the application to be run in a development environment and be accessible from other devices on the network.