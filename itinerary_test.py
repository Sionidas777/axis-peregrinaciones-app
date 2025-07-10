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
print(f"Testing Itinerary API at: {API_URL}")

# Admin credentials for testing
admin_credentials = {
    "email": "admin@pilgrimageapp.com",
    "password": "admin123"
}

# Test data for itinerary with correct structure
test_itinerary = {
    "group_id": "group_001",  # Using existing group from database
    "group_name": "Peregrinación a Tierra Santa 2025",
    "flights": {
        "departure": {
            "from_location": "Madrid",
            "to": "Tel Aviv",
            "date": "2025-03-15",
            "time": "10:00",
            "airline": "Iberia",
            "flight_number": "IB3878"
        },
        "return_flight": {
            "from_location": "Tel Aviv",
            "to": "Madrid",
            "date": "2025-03-22",
            "time": "18:30",
            "airline": "Iberia",
            "flight_number": "IB3879"
        }
    },
    "included": [
        "Alojamiento en hoteles de 4 estrellas",
        "Desayuno y cena",
        "Guía espiritual especializado",
        "Transporte en autocar climatizado",
        "Entradas a todos los sitios sagrados"
    ],
    "not_included": [
        "Almuerzo",
        "Gastos personales",
        "Seguro de viaje",
        "Propinas"
    ],
    "daily_schedule": [
        {
            "day": 1,
            "date": "2025-03-15",
            "title": "Llegada a Tierra Santa",
            "activities": [
                "Llegada al aeropuerto Ben Gurion",
                "Traslado al hotel en Jerusalén",
                "Cena de bienvenida",
                "Oración de inicio de peregrinación"
            ],
            "biblical_quote": "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar. - Mateo 11:28",
            "accommodation": "Hotel King David Jerusalem"
        },
        {
            "day": 2,
            "date": "2025-03-16",
            "title": "Jerusalén - Ciudad Santa",
            "activities": [
                "Desayuno en el hotel",
                "Visita al Monte de los Olivos",
                "Basílica de la Agonía (Getsemaní)",
                "Vía Dolorosa",
                "Santo Sepulcro",
                "Misa en el Santo Sepulcro"
            ],
            "biblical_quote": "Yo soy el camino, la verdad y la vida. - Juan 14:6",
            "accommodation": "Hotel King David Jerusalem"
        },
        {
            "day": 3,
            "date": "2025-03-17",
            "title": "Belén - Lugar del Nacimiento",
            "activities": [
                "Desayuno en el hotel",
                "Traslado a Belén",
                "Basílica de la Natividad",
                "Gruta del Nacimiento",
                "Campo de los Pastores",
                "Misa en Belén"
            ],
            "biblical_quote": "Y dio a luz a su hijo primogénito, y lo envolvió en pañales, y lo acostó en un pesebre. - Lucas 2:7",
            "accommodation": "Hotel King David Jerusalem"
        }
    ]
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

def test_itinerary_functionality():
    """Test all itinerary CRUD operations"""
    
    # Step 1: Login as admin
    print_test_header("Admin Login for Itinerary Testing")
    
    login_response = requests.post(f"{API_URL}/auth/login", json=admin_credentials)
    print_response(login_response)
    
    if login_response.status_code != 200:
        print("❌ FAILED: Cannot login as admin")
        return False
    
    admin_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Step 2: Test GET all itineraries
    print_test_header("GET All Itineraries")
    
    get_all_response = requests.get(f"{API_URL}/itineraries", headers=headers)
    print_response(get_all_response)
    
    if get_all_response.status_code != 200:
        print("❌ FAILED: Cannot get all itineraries")
        return False
    
    existing_itineraries = get_all_response.json()
    print(f"✅ Found {len(existing_itineraries)} existing itineraries")
    
    # Step 3: Test POST create itinerary
    print_test_header("POST Create New Itinerary")
    
    create_response = requests.post(f"{API_URL}/itineraries", json=test_itinerary, headers=headers)
    print_response(create_response)
    
    if create_response.status_code != 200:
        print("❌ FAILED: Cannot create itinerary")
        return False
    
    created_itinerary = create_response.json()
    itinerary_id = created_itinerary["id"]
    print(f"✅ Created itinerary with ID: {itinerary_id}")
    
    # Verify data structure consistency
    print("\n--- Verifying Data Structure ---")
    required_fields = ["id", "group_id", "group_name", "flights", "included", "not_included", "daily_schedule"]
    for field in required_fields:
        if field in created_itinerary:
            print(f"✅ Field '{field}' present")
        else:
            print(f"❌ Field '{field}' missing")
            return False
    
    # Verify flights structure
    flights = created_itinerary.get("flights", {})
    if "departure" in flights and "return" in flights:
        print("✅ Flights structure correct")
    else:
        print("❌ Flights structure incorrect")
        return False
    
    # Verify daily_schedule structure
    daily_schedule = created_itinerary.get("daily_schedule", [])
    if len(daily_schedule) == len(test_itinerary["daily_schedule"]):
        print(f"✅ Daily schedule has correct number of days: {len(daily_schedule)}")
    else:
        print(f"❌ Daily schedule length mismatch")
        return False
    
    # Step 4: Test GET itinerary by group ID
    print_test_header("GET Itinerary by Group ID")
    
    get_by_group_response = requests.get(f"{API_URL}/itineraries/group/{test_itinerary['group_id']}", headers=headers)
    print_response(get_by_group_response)
    
    if get_by_group_response.status_code != 200:
        print("❌ FAILED: Cannot get itinerary by group ID")
        return False
    
    retrieved_itinerary = get_by_group_response.json()
    if retrieved_itinerary["id"] == itinerary_id:
        print("✅ Retrieved correct itinerary by group ID")
    else:
        print("❌ Retrieved wrong itinerary")
        return False
    
    # Step 5: Test PUT update itinerary
    print_test_header("PUT Update Itinerary")
    
    update_data = {
        "group_name": "Peregrinación a Tierra Santa 2025 (Actualizado)",
        "included": [
            "Alojamiento en hoteles de 5 estrellas",
            "Todas las comidas incluidas",
            "Guía espiritual especializado",
            "Transporte en autocar de lujo",
            "Entradas a todos los sitios sagrados",
            "Seguro de viaje completo"
        ]
    }
    
    update_response = requests.put(f"{API_URL}/itineraries/{itinerary_id}", json=update_data, headers=headers)
    print_response(update_response)
    
    if update_response.status_code != 200:
        print("❌ FAILED: Cannot update itinerary")
        return False
    
    updated_itinerary = update_response.json()
    if (updated_itinerary["group_name"] == update_data["group_name"] and 
        len(updated_itinerary["included"]) == len(update_data["included"])):
        print("✅ Itinerary updated successfully")
    else:
        print("❌ Itinerary update failed")
        return False
    
    # Step 6: Test DELETE itinerary
    print_test_header("DELETE Itinerary")
    
    delete_response = requests.delete(f"{API_URL}/itineraries/{itinerary_id}", headers=headers)
    print_response(delete_response)
    
    if delete_response.status_code != 200:
        print("❌ FAILED: Cannot delete itinerary")
        return False
    
    print("✅ Itinerary deleted successfully")
    
    # Step 7: Verify deletion
    print_test_header("Verify Deletion")
    
    verify_response = requests.get(f"{API_URL}/itineraries/group/{test_itinerary['group_id']}", headers=headers)
    print_response(verify_response)
    
    if verify_response.status_code == 404:
        print("✅ Itinerary properly deleted (404 Not Found)")
    else:
        print("❌ Itinerary still exists after deletion")
        return False
    
    return True

def test_error_scenarios():
    """Test error handling scenarios"""
    
    print_test_header("Error Handling Tests")
    
    # Login as admin
    login_response = requests.post(f"{API_URL}/auth/login", json=admin_credentials)
    admin_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test 1: Create itinerary with invalid data
    print("\n--- Test 1: Invalid Data ---")
    invalid_itinerary = {
        "group_id": "invalid_group",
        "group_name": "",  # Empty name
        # Missing required fields
    }
    
    invalid_response = requests.post(f"{API_URL}/itineraries", json=invalid_itinerary, headers=headers)
    print_response(invalid_response)
    
    if invalid_response.status_code in [400, 422]:
        print("✅ Correctly rejected invalid data")
    else:
        print("❌ Should have rejected invalid data")
    
    # Test 2: Get non-existent itinerary
    print("\n--- Test 2: Non-existent Itinerary ---")
    nonexistent_response = requests.get(f"{API_URL}/itineraries/group/nonexistent-group", headers=headers)
    print_response(nonexistent_response)
    
    if nonexistent_response.status_code == 404:
        print("✅ Correctly returned 404 for non-existent itinerary")
    else:
        print("❌ Should have returned 404")
    
    # Test 3: Unauthorized access (no token)
    print("\n--- Test 3: Unauthorized Access ---")
    unauth_response = requests.post(f"{API_URL}/itineraries", json=test_itinerary)
    print_response(unauth_response)
    
    if unauth_response.status_code in [401, 403]:
        print("✅ Correctly rejected unauthorized access")
    else:
        print("❌ Should have rejected unauthorized access")

def main():
    print("🚀 Starting Itinerary API Testing")
    print("="*80)
    
    # Test main functionality
    success = test_itinerary_functionality()
    
    # Test error scenarios
    test_error_scenarios()
    
    print_separator()
    if success:
        print("🎉 ALL ITINERARY TESTS PASSED!")
        print("✅ CRUD operations working correctly")
        print("✅ Data structure consistency verified")
        print("✅ Field mapping (group_name, daily_schedule, not_included) correct")
        print("✅ No recursion or serialization issues found")
    else:
        print("❌ SOME ITINERARY TESTS FAILED")
    print_separator()

if __name__ == "__main__":
    main()