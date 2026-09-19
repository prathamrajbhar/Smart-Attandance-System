"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassLoader from "@/components/ui/GlassLoader";
import GeofenceMap from "@/components/teacher/GeofenceMap";
import GeofenceControls from "@/components/teacher/GeofenceControls";
import type { AcademicClassWithGeofence } from "@/types";

export default function ClassDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [cls, setCls] = useState<AcademicClassWithGeofence | null>(null);
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.209);
  const [radius, setRadius] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClass(): Promise<void> {
      try {
        const { data } = await api.get<AcademicClassWithGeofence[]>("/teacher/my-classes");
        const found = data.find((c) => c.id === id);
        if (found) {
          setCls(found);
          if (found.geofence) {
            setLat(found.geofence.latitude);
            setLng(found.geofence.longitude);
            setRadius(found.geofence.radiusMeters);
          }
        }
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, "Failed to load class details"));
      } finally {
        setLoading(false);
      }
    }
    void fetchClass();
  }, [id]);

  const handleLocationChange = useCallback((newLat: number, newLng: number): void => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  if (loading) return <GlassLoader text="Loading class..." />;
  if (!cls) return <div className="text-center py-20 text-slate-500">Class not found</div>;

  return (
    <div className="animate-fade-in-up">
      <GlassBreadcrumb
        items={[{ label: "My Classes", href: "/teacher/classes" }, { label: cls.name }]}
      />

      <GlassPageHeader
        title={cls.name}
        description={`${cls.subject} — Configure geofence and export attendance`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard padding="sm" className="overflow-hidden">
            <GeofenceMap
              lat={lat}
              lng={lng}
              radius={radius}
              onLocationChange={handleLocationChange}
            />
          </GlassCard>
        </div>

        <div>
          <GeofenceControls
            classId={id}
            classNameTitle={cls.name}
            lat={lat}
            lng={lng}
            radius={radius}
            onRadiusChange={setRadius}
          />
        </div>
      </div>
    </div>
  );
}
