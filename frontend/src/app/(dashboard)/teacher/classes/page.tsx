"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, BookOpen, Users } from "lucide-react";
import api from "@/lib/api";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import GlassLoader from "@/components/ui/GlassLoader";
import GlassEmptyState from "@/components/ui/GlassEmptyState";
import GlassButton from "@/components/ui/GlassButton";
import type { AcademicClassWithGeofence } from "@/types";

export default function TeacherClassesPage(): React.ReactElement {
  const router = useRouter();
  const [classes, setClasses] = useState<AcademicClassWithGeofence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch(): Promise<void> {
      try { 
        const { data } = await api.get<AcademicClassWithGeofence[]>("/teacher/my-classes"); 
        setClasses(data); 
      }
      catch { 
        setClasses([]); 
      }
      finally { 
        setLoading(false); 
      }
    }
    fetch();
  }, []);

  if (loading) return <GlassLoader text="Loading your assigned classes..." />;

  return (
    <div className="space-y-6">
      <GlassPageHeader title="My Classes" description="Manage academic rosters, lecture schedules, and geofence parameters" />

      {classes.length === 0 ? (
        <GlassEmptyState title="No Classes Assigned" message="Contact your institution administrator to receive class assignments." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls) => (
            <GlassCard 
              key={cls.id} 
              hoverable 
              padding="md" 
              className="bg-card flex flex-col justify-between h-full"
            >
              <div 
                onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                className="cursor-pointer flex-grow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-secondary text-primary">
                    <BookOpen size={18} />
                  </div>
                  {cls.geofence ? (
                    <GlassBadge variant="success"><MapPin size={10} className="mr-0.5" /> Geofence Active</GlassBadge>
                  ) : (
                    <GlassBadge variant="neutral">No Geofence</GlassBadge>
                  )}
                </div>
                
                <h3 className="text-base font-bold text-foreground font-[Outfit] tracking-tight">{cls.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cls.subject}</p>
              </div>
              
              <div className="border-t border-border pt-3.5 mt-4">
                <div className="flex items-center justify-between mb-3 text-xs">
                  {cls.geofence ? (
                    <span className="text-muted-foreground font-medium">
                      Radius: <strong className="text-foreground">{cls.geofence.radiusMeters}m</strong>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Setup Required</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                    icon={<MapPin size={12} />}
                  >
                    Geofence
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => router.push(`/teacher/sessions?classId=${cls.id}`)}
                    icon={<Users size={12} />}
                  >
                    Attendance
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
