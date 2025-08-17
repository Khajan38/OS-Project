#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

from flask import Blueprint, jsonify, request
from backend.algorithm import getAlgorithm
algorithms_bp = Blueprint('algorithms', __name__)

@algorithms_bp.route('/getData', methods=['GET'])
def getData():
    algorithm = request.args.get("algorithm")
    noOfProcesses = request.args.get("noOfProcesses")
    source = request.args.get("source")
    return jsonify(getAlgorithm(algorithm, noOfProcesses, source)), 200