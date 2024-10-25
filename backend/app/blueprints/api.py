from flask import Blueprint, jsonify, request
from ..config import veryfi_config
import requests
from datetime import datetime
import json  # Import json to parse the categories
from ..categorizer import get_category

api_bp = Blueprint("api", __name__)

@api_bp.route("/process-receipt", methods=['POST'])
def process_receipt():
    # Get the uploaded file from the request
    file = request.files['file']

    # Get categories from the request form data and parse it as a list
    categories = json.loads(request.form.get('categories', '[]'))

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
    vf_date = datetime.strptime(vf_data['date'], "%Y-%m-%d %H:%M:%S").strftime("%Y-%m-%d")
    vf_items = []
    for item in vf_data.get('line_items', []):
        vf_items.append(item['description'])

    vendor = vf_data['vendor']['name']
    categories = ", ".join(categories)
    category = get_category(vendor, categories)

    receipt_data = {
        'vendor': vf_data['vendor']['name'],
        'total': vf_data['total'],
        'category': category,
        'date': vf_date,
        'items': vf_items,
    }

    return jsonify(receipt_data), 201
