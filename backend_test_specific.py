#!/usr/bin/env python3
import requests
import json
import sys

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1]
            break

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

# Test credentials
admin_credentials = {
    "email": "admin@pilgrimageapp.com",
    "password": "admin123"
}

pilgrim_credentials = {
    "email": "maria@email.com",
    "password": "password"
}

# Store tokens
tokens = {
    "admin": None,
    "pilgrim": None
}

def print_separator():
    print("\n" + "="*80 + "\n")

def print_test_header(test_name):
    print_separator()
    print(f"TESTING: {test_name}")
    print_separator()

def print_response(response):
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_health_check():
    print_test_header("Health Check Endpoint")
    response = requests.get(f"{API_URL}/health")
    print_response(response)
    
    if response.status_code == 200:
        print("✅ Health check endpoint is working")
        return True
    else:
        print("❌ Health check endpoint failed")
        return False

def test_login():
    print_test_header("Authentication - Login")
    
    # Test admin login
    print("Logging in as admin...")
    response = requests.post(f"{API_URL}/auth/login", json=admin_credentials)
    print_response(response)
    
    admin_success = False
    if response.status_code == 200:
        tokens["admin"] = response.json()["access_token"]
        print(f"✅ Admin login successful, token received")
        admin_success = True
    else:
        print(f"❌ Admin login failed: {response.text}")
    
    # Test pilgrim login
    print("\nLogging in as pilgrim...")
    response = requests.post(f"{API_URL}/auth/login", json=pilgrim_credentials)
    print_response(response)
    
    pilgrim_success = False
    if response.status_code == 200:
        tokens["pilgrim"] = response.json()["access_token"]
        print(f"✅ Pilgrim login successful, token received")
        pilgrim_success = True
    else:
        print(f"❌ Pilgrim login failed: {response.text}")
    
    return admin_success and pilgrim_success

def test_group_endpoint():
    print_test_header("Group Endpoint - Get Specific Group")
    
    if not tokens["admin"]:
        print("❌ Skipping group test because admin login failed")
        return False
    
    print("Getting group with ID 'group_001' as admin...")
    response = requests.get(
        f"{API_URL}/groups/group_001",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        group = response.json()
        if group["id"] == "group_001":
            print("✅ Group details verified")
            return True
        else:
            print(f"❌ Group ID mismatch: expected 'group_001', got '{group['id']}'")
            return False
    else:
        print(f"❌ Failed to get group: {response.text}")
        return False

def test_destinations_endpoint():
    print_test_header("Destinations Endpoint - Get All Destinations")
    
    print("Getting all destinations (public endpoint)...")
    response = requests.get(f"{API_URL}/destinations")
    print_response(response)
    
    if response.status_code == 200:
        destinations = response.json()
        if isinstance(destinations, list):
            print(f"✅ Retrieved {len(destinations)} destinations")
            return True
        else:
            print("❌ Response is not a list of destinations")
            return False
    else:
        print(f"❌ Failed to get destinations: {response.text}")
        return False

def test_spiritual_content_endpoint():
    print_test_header("Spiritual Content Endpoint - Get All Content")
    
    print("Getting all spiritual content (public endpoint)...")
    response = requests.get(f"{API_URL}/spiritual-content")
    print_response(response)
    
    if response.status_code == 200:
        content = response.json()
        if isinstance(content, list):
            print(f"✅ Retrieved {len(content)} spiritual content items")
            return True
        else:
            print("❌ Response is not a list of spiritual content")
            return False
    else:
        print(f"❌ Failed to get spiritual content: {response.text}")
        return False

def run_tests():
    results = {
        "health_check": test_health_check(),
        "login": test_login(),
        "group_endpoint": test_group_endpoint(),
        "destinations_endpoint": test_destinations_endpoint(),
        "spiritual_content_endpoint": test_spiritual_content_endpoint()
    }
    
    print_separator()
    print("TEST SUMMARY")
    print_separator()
    
    all_passed = True
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        if not result:
            all_passed = False
        print(f"{test_name}: {status}")
    
    print_separator()
    if all_passed:
        print("🎉 ALL TESTS PASSED! The backend API is working correctly.")
        sys.exit(0)
    else:
        print("❌ SOME TESTS FAILED. See details above.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()