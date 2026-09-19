from app.utils.geofencing import GPSCoordinate, calculate_haversine_distance, is_within_geofence


def test_haversine_same_point():
    coord = GPSCoordinate(latitude=19.0760, longitude=72.8777)
    dist = calculate_haversine_distance(coord, coord)
    assert dist == 0.0


def test_haversine_known_distance():
    # Distance between Mumbai (19.0760, 72.8777) and Pune (18.5204, 73.8567) is ~120km
    mumbai = GPSCoordinate(latitude=19.0760, longitude=72.8777)
    pune = GPSCoordinate(latitude=18.5204, longitude=73.8567)
    dist = calculate_haversine_distance(mumbai, pune)
    assert 115000 <= dist <= 125000


def test_is_within_geofence_inside():
    classroom = GPSCoordinate(latitude=28.6139, longitude=77.2090)
    # Student 10m away
    student = GPSCoordinate(latitude=28.61395, longitude=77.20905)
    inside = is_within_geofence(
        student_coord=student,
        classroom_coord=classroom,
        base_radius=50.0,
        student_accuracy=5.0,
    )
    assert inside is True


def test_is_within_geofence_outside():
    classroom = GPSCoordinate(latitude=28.6139, longitude=77.2090)
    # Student 500m away
    student = GPSCoordinate(latitude=28.6180, longitude=77.2140)
    inside = is_within_geofence(
        student_coord=student,
        classroom_coord=classroom,
        base_radius=30.0,
        student_accuracy=5.0,
    )
    assert inside is False
