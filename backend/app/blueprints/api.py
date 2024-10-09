from flask import Blueprint, jsonify, request


api_bp = Blueprint("api", __name__)


@api_bp.route("/process-receipt", methods=['POST'])
def process_receipt():
    pass  # Receives image, processes with VeryFi, returns extracted data