import unittest
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tests.test_geofencing import test_haversine_same_point, test_haversine_known_distance, test_is_within_geofence_inside, test_is_within_geofence_outside
from tests.test_security import test_password_hashing_and_verification, test_jwt_token_generation_and_decoding, test_smart_pass_token_payload, test_expired_token_handling
from tests.test_health_and_api import test_public_health_endpoint, test_invalid_auth_token_rejected


class TestSmartAttendanceSuite(unittest.TestCase):
    def test_geofencing_suite(self):
        test_haversine_same_point()
        test_haversine_known_distance()
        test_is_within_geofence_inside()
        test_is_within_geofence_outside()

    def test_security_suite(self):
        test_password_hashing_and_verification()
        test_jwt_token_generation_and_decoding()
        test_smart_pass_token_payload()
        test_expired_token_handling()

    def test_health_suite(self):
        test_public_health_endpoint()
        test_invalid_auth_token_rejected()


if __name__ == "__main__":
    unittest.main(verbosity=2)
