#!/usr/bin/env python3
import requests
import json
import uuid
import os
from datetime import datetime, timedelta

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1]
            break

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

# Test data
pilgrim_credentials = {
    "email": "maria@email.com",
    "password": "password"
}

admin_credentials = {
    "email": "admin@pilgrimageapp.com",
    "password": "admin123"
}

# Store tokens
tokens = {
    "admin": None,
    "pilgrim": None
}

# Test results
test_results = {
    "health_check": {"success": False, "details": ""},
    "pilgrim_login": {"success": False, "details": ""},
    "admin_login": {"success": False, "details": ""},
    "get_group_pilgrim": {"success": False, "details": ""},
    "get_all_groups_admin": {"success": False, "details": ""},
    "get_destinations": {"success": False, "details": ""},
    "get_spiritual_content": {"success": False, "details": ""},
    "create_destination": {"success": False, "details": ""},
    "update_destination": {"success": False, "details": ""},
    "delete_destination": {"success": False, "details": ""}
}

created_ids = {
    "destination_id": None
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
    print_test_header("Health Check")
    
    print("Testing health check endpoint...")
    response = requests.get(f"{API_URL}/health")
    print_response(response)
    
    if response.status_code == 200 and response.json().get("status") == "healthy":
        test_results["health_check"]["success"] = True
        test_results["health_check"]["details"] = "Health check endpoint is working correctly"
    else:
        test_results["health_check"]["details"] = f"Health check failed: {response.text}"

def test_pilgrim_login():
    print_test_header("Pilgrim Login")
    
    print("Logging in as pilgrim...")
    response = requests.post(f"{API_URL}/auth/login", json=pilgrim_credentials)
    print_response(response)
    
    if response.status_code == 200:
        tokens["pilgrim"] = response.json()["access_token"]
        user_data = response.json().get("user", {})
        print(f"Pilgrim login successful, token received")
        print(f"User data: {user_data}")
        
        if user_data.get("role") == "pilgrim" and user_data.get("name"):
            test_results["pilgrim_login"]["success"] = True
            test_results["pilgrim_login"]["details"] = f"Successfully logged in as pilgrim: {user_data.get('name')}"
        else:
            test_results["pilgrim_login"]["details"] = "Login successful but user data is incomplete"
    else:
        test_results["pilgrim_login"]["details"] = f"Failed to login as pilgrim: {response.text}"

def test_admin_login():
    print_test_header("Admin Login")
    
    print("Logging in as admin...")
    response = requests.post(f"{API_URL}/auth/login", json=admin_credentials)
    print_response(response)
    
    if response.status_code == 200:
        tokens["admin"] = response.json()["access_token"]
        user_data = response.json().get("user", {})
        print(f"Admin login successful, token received")
        print(f"User data: {user_data}")
        
        if user_data.get("role") == "admin" and user_data.get("name"):
            test_results["admin_login"]["success"] = True
            test_results["admin_login"]["details"] = f"Successfully logged in as admin: {user_data.get('name')}"
        else:
            test_results["admin_login"]["details"] = "Login successful but user data is incomplete"
    else:
        test_results["admin_login"]["details"] = f"Failed to login as admin: {response.text}"

def test_get_group_pilgrim():
    print_test_header("Get Group (Pilgrim)")
    
    if not tokens["pilgrim"]:
        test_results["get_group_pilgrim"]["details"] = "Skipped because pilgrim login failed"
        return
    
    print("Getting group_001 as pilgrim...")
    response = requests.get(
        f"{API_URL}/groups/group_001",
        headers={"Authorization": f"Bearer {tokens['pilgrim']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        group_data = response.json()
        if group_data.get("id") == "group_001" and group_data.get("name"):
            test_results["get_group_pilgrim"]["success"] = True
            test_results["get_group_pilgrim"]["details"] = f"Successfully retrieved group_001: {group_data.get('name')}"
        else:
            test_results["get_group_pilgrim"]["details"] = "Group data is incomplete or incorrect"
    else:
        test_results["get_group_pilgrim"]["details"] = f"Failed to get group_001: {response.text}"

def test_get_all_groups_admin():
    print_test_header("Get All Groups (Admin)")
    
    if not tokens["admin"]:
        test_results["get_all_groups_admin"]["details"] = "Skipped because admin login failed"
        return
    
    print("Getting all groups as admin...")
    response = requests.get(
        f"{API_URL}/groups",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        groups = response.json()
        if isinstance(groups, list):
            print(f"Retrieved {len(groups)} groups")
            test_results["get_all_groups_admin"]["success"] = True
            test_results["get_all_groups_admin"]["details"] = f"Successfully retrieved all groups ({len(groups)} groups)"
        else:
            test_results["get_all_groups_admin"]["details"] = "Response is not a list of groups"
    else:
        test_results["get_all_groups_admin"]["details"] = f"Failed to get all groups: {response.text}"

def test_get_destinations():
    print_test_header("Get Destinations (Public)")
    
    print("Getting all destinations...")
    response = requests.get(f"{API_URL}/destinations")
    print_response(response)
    
    if response.status_code == 200:
        destinations = response.json()
        if isinstance(destinations, list):
            print(f"Retrieved {len(destinations)} destinations")
            test_results["get_destinations"]["success"] = True
            test_results["get_destinations"]["details"] = f"Successfully retrieved all destinations ({len(destinations)} destinations)"
        else:
            test_results["get_destinations"]["details"] = "Response is not a list of destinations"
    else:
        test_results["get_destinations"]["details"] = f"Failed to get all destinations: {response.text}"

def test_get_spiritual_content():
    print_test_header("Get Spiritual Content (Public)")
    
    print("Getting all spiritual content...")
    response = requests.get(f"{API_URL}/spiritual-content")
    print_response(response)
    
    if response.status_code == 200:
        content = response.json()
        if isinstance(content, list):
            print(f"Retrieved {len(content)} spiritual content items")
            test_results["get_spiritual_content"]["success"] = True
            test_results["get_spiritual_content"]["details"] = f"Successfully retrieved all spiritual content ({len(content)} items)"
        else:
            test_results["get_spiritual_content"]["details"] = "Response is not a list of spiritual content"
    else:
        test_results["get_spiritual_content"]["details"] = f"Failed to get all spiritual content: {response.text}"

def test_create_destination():
    print_test_header("Create Destination (Admin)")
    
    if not tokens["admin"]:
        test_results["create_destination"]["details"] = "Skipped because admin login failed"
        return
    
    test_destination = {
        "name": "Tierra Santa",
        "country": "Israel",
        "description": "Lugar sagrado para las tres religiones monoteístas",
        "facts": [
            "Jerusalén es una de las ciudades más antiguas del mundo",
            "El Mar Muerto es el punto más bajo de la Tierra",
            "Israel tiene más museos per cápita que cualquier otro país"
        ],
        "spiritual_significance": "Tierra Santa es el escenario de numerosos eventos bíblicos y religiosos",
        "image_url": "https://images.unsplash.com/photo-1544734037-e4ec2e0c3e6a"
    }
    
    print("Creating new destination...")
    response = requests.post(
        f"{API_URL}/destinations",
        json=test_destination,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        created_ids["destination_id"] = response.json()["id"]
        print(f"Destination created with ID: {created_ids['destination_id']}")
        test_results["create_destination"]["success"] = True
        test_results["create_destination"]["details"] = f"Successfully created destination: {test_destination['name']}"
    else:
        test_results["create_destination"]["details"] = f"Failed to create destination: {response.text}"

def test_update_destination():
    print_test_header("Update Destination (Admin)")
    
    if not tokens["admin"] or not created_ids["destination_id"]:
        test_results["update_destination"]["details"] = "Skipped because admin login or destination creation failed"
        return
    
    update_data = {
        "description": "Tierra Santa, cuna de las religiones monoteístas y lugar de peregrinación",
        "facts": [
            "Jerusalén es una de las ciudades más antiguas del mundo",
            "El Mar Muerto es el punto más bajo de la Tierra",
            "Israel tiene más museos per cápita que cualquier otro país",
            "Nazaret es la ciudad donde Jesús pasó su infancia"
        ]
    }
    
    print("Updating destination...")
    response = requests.put(
        f"{API_URL}/destinations/{created_ids['destination_id']}",
        json=update_data,
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        updated_destination = response.json()
        if updated_destination["id"] == created_ids["destination_id"] and updated_destination["description"] == update_data["description"]:
            print("Destination update verified")
            test_results["update_destination"]["success"] = True
            test_results["update_destination"]["details"] = "Successfully updated destination"
        else:
            test_results["update_destination"]["details"] = "Updated destination details don't match expected values"
    else:
        test_results["update_destination"]["details"] = f"Failed to update destination: {response.text}"

def test_delete_destination():
    print_test_header("Delete Destination (Admin)")
    
    if not tokens["admin"] or not created_ids["destination_id"]:
        test_results["delete_destination"]["details"] = "Skipped because admin login or destination creation failed"
        return
    
    print("Deleting destination...")
    response = requests.delete(
        f"{API_URL}/destinations/{created_ids['destination_id']}",
        headers={"Authorization": f"Bearer {tokens['admin']}"}
    )
    print_response(response)
    
    if response.status_code == 200:
        print("Destination deleted successfully")
        
        # Verify deletion
        print("\nVerifying deletion...")
        response = requests.get(f"{API_URL}/destinations/{created_ids['destination_id']}")
        print_response(response)
        
        if response.status_code == 404:
            print("Deletion verified - destination no longer exists")
            test_results["delete_destination"]["success"] = True
            test_results["delete_destination"]["details"] = "Successfully deleted destination and verified deletion"
        else:
            test_results["delete_destination"]["details"] = f"Destination was not properly deleted, got status code {response.status_code}"
    else:
        test_results["delete_destination"]["details"] = f"Failed to delete destination: {response.text}"

def print_test_summary():
    print_separator()
    print("FINAL TEST SUMMARY")
    print_separator()
    
    all_passed = True
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result["success"] else "❌ FAILED"
        if not result["success"]:
            all_passed = False
        print(f"{test_name}: {status}")
        print(f"  {result['details']}")
        print()
    
    print_separator()
    if all_passed:
        print("🎉 ALL TESTS PASSED! The backend API is fully functional.")
    else:
        print("❌ SOME TESTS FAILED. See details above.")
    print_separator()

def run_tests():
    # 1. Test Health Check
    test_health_check()
    
    # 2. Test Login Endpoints
    test_pilgrim_login()
    test_admin_login()
    
    # 3. Test Data Endpoints
    test_get_group_pilgrim()
    test_get_all_groups_admin()
    test_get_destinations()
    test_get_spiritual_content()
    
    # 4. Test Admin CRUD Operations
    test_create_destination()
    test_update_destination()
    test_delete_destination()
    
    # Print summary
    print_test_summary()

if __name__ == "__main__":
    run_tests()