from flask import Blueprint, jsonify, request
from ..config import veryfi_config
import requests


api_bp = Blueprint("api", __name__)


@api_bp.route("/process-receipt", methods=['POST'])
def process_receipt():
    # Get the uploaded file from the request
    file = request.files['file']

    # Set parameters for forwarding image to VeryFI
    files = {
        'file': (file.filename, file, file.content_type) 
    }

    vf_client_id = veryfi_config['client_id']
    vf_username = veryfi_config['username']
    vf_api_key = veryfi_config['api_key']
    vf_api_url = veryfi_config['api_url']

    headers = {
        'Accept': 'application/json',
        'Client-Id': vf_client_id,
        'Authorization': f"apikey {vf_username}:{vf_api_key}"
    }

    # Send the file to VeryFI to process
    vf_response = requests.post(vf_api_url, headers=headers, files=files)

    # Return extracted receipt details from VeryFI
    vf_data = vf_response.json()
    receipt_data = {
        'vendor': vf_data['vendor']['name'],
        'category': vf_data['vendor']['category'],
        'total': vf_data['total'],
        'subtotal': vf_data['subtotal'],
        'tax': vf_data['tax'],
        'date': vf_data['date']
    }

    return jsonify(receipt_data), 201