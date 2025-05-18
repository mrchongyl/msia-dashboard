from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

ASEAN_COUNTRIES = ["BRN", "KHM", "IDN", "LAO", "MYS", "MMR", "PHL", "SGP", "THA", "VNM"]

@app.route('/api/gdp-per-capita', methods=['GET'])
def get_gdp_per_capita():
    """Proxy endpoint to fetch GDP per capita data from World Bank Data360 API for ASEAN countries"""
    try:
        # Parse query parameters
        start_year = request.args.get('from', '1960')
        end_year = request.args.get('to', '2023')
        country = request.args.get('country', 'MYS').upper()
        # World Bank API endpoint
        url = f"https://data360api.worldbank.org/data360/data"
        # Query parameters
        params = {
            'DATABASE_ID': 'WB_WDI',
            'INDICATOR': 'WB_WDI_NY_GDP_PCAP_CD',
            'REF_AREA': country,
            'timePeriodFrom': start_year,
            'timePeriodTo': end_year,
            'skip': 0
        }
        # Make request to World Bank API
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise exception for HTTP errors
        wb_data = response.json()
        # Always wrap the response in a 'data' property
        if isinstance(wb_data, dict) and 'data' in wb_data:
            return jsonify({'data': wb_data['data']})
        else:
            return jsonify({'data': wb_data})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/credit-card-usage', methods=['GET'])
def get_credit_card_usage():
    """Proxy endpoint to fetch credit card usage data from World Bank Data360 API for ASEAN countries"""
    try:
        start_year = request.args.get('from', '1960')
        end_year = request.args.get('to', '2023')
        country = request.args.get('country', 'MYS').upper()
        url = f"https://data360api.worldbank.org/data360/data"
        params = {
            'DATABASE_ID': 'IMF_FAS',
            'INDICATOR': 'IMF_FAS_FCCCC',
            'REF_AREA': country,
            'timePeriodFrom': start_year,
            'timePeriodTo': end_year,
            'skip': 0
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        wb_data = response.json()
        if isinstance(wb_data, dict) and 'data' in wb_data and isinstance(wb_data['data'], list):
            return jsonify({'data': wb_data['data']})
        elif isinstance(wb_data, dict) and 'value' in wb_data:
            return jsonify({'data': wb_data['value']})
        else:
            return jsonify({'data': []})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/inflation', methods=['GET'])
def get_inflation():
    """Proxy endpoint to fetch inflation (CPI, annual %) data from World Bank Data360 API for ASEAN countries"""
    try:
        start_year = request.args.get('from', '1960')
        end_year = request.args.get('to', '2023')
        country = request.args.get('country', 'MYS').upper()
        url = f"https://data360api.worldbank.org/data360/data"
        params = {
            'DATABASE_ID': 'WB_WDI',
            'INDICATOR': 'WB_WDI_FP_CPI_TOTL_ZG',
            'REF_AREA': country,
            'timePeriodFrom': start_year,
            'timePeriodTo': end_year,
            'skip': 0
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        wb_data = response.json()
        if isinstance(wb_data, dict) and 'data' in wb_data:
            return jsonify({'data': wb_data['data']})
        else:
            return jsonify({'data': wb_data})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/cpi', methods=['GET'])
def get_cpi():
    """Proxy endpoint to fetch Consumer Price Index (CPI) data from World Bank Data360 API for ASEAN countries"""
    try:
        start_year = request.args.get('from', '1960')
        end_year = request.args.get('to', '2023')
        country = request.args.get('country', 'MYS').upper()
        url = f"https://data360api.worldbank.org/data360/data"
        params = {
            'DATABASE_ID': 'WB_WDI',
            'INDICATOR': 'WB_WDI_FP_CPI_TOTL',
            'REF_AREA': country,
            'timePeriodFrom': start_year,
            'timePeriodTo': end_year,
            'skip': 0
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        wb_data = response.json()
        if isinstance(wb_data, dict) and 'data' in wb_data:
            return jsonify({'data': wb_data['data']})
        else:
            return jsonify({'data': wb_data})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/mobile-internet-banking', methods=['GET'])
def get_mobile_internet_banking():
    """Proxy endpoint to fetch Mobile & Internet Banking data from World Bank Data360 API for ASEAN countries"""
    try:
        start_year = request.args.get('from', '1960')
        end_year = request.args.get('to', '2024')
        country = request.args.get('country', 'MYS').upper()
        unit_measure = request.args.get('unit_measure')
        url = f"https://data360api.worldbank.org/data360/data"
        params = {
            'DATABASE_ID': 'IMF_FAS',
            'INDICATOR': 'IMF_FAS_FCMIBT',
            'REF_AREA': country,
            'timePeriodFrom': start_year,
            'timePeriodTo': end_year,
            'skip': 0
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        wb_data = response.json()
        # Always wrap the response in a 'data' property
        if isinstance(wb_data, dict) and 'data' in wb_data and isinstance(wb_data['data'], list):
            return jsonify({'data': wb_data['data']})
        elif isinstance(wb_data, dict) and 'value' in wb_data:
            return jsonify({'data': wb_data['value']})
        else:
            return jsonify({'data': []})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)