/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataItem } from "@/components/metadata/metadata-item";
import { User, Mail, Phone, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

// Example of how to use the generic MetadataItem component for different purposes

// User Profile Metadata
export const UserProfileMetadata = ({ user }: { user: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetadataItem
        icon={<User className="h-4 w-4 text-primary" />}
        label="Name"
        value={user.name}
        iconBgColor="bg-primary/10"
      />
      <MetadataItem
        icon={<Mail className="h-4 w-4 text-blue-500" />}
        label="Email"
        value={user.email}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <MetadataItem
        icon={<Phone className="h-4 w-4 text-green-500" />}
        label="Phone"
        value={user.phone}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
    </div>
  );
};

// Event Metadata
export const EventMetadata = ({ event }: { event: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetadataItem
        icon={<Calendar className="h-4 w-4 text-primary" />}
        label="Date"
        value={format(new Date(event.date), "MMM dd, yyyy")}
        iconBgColor="bg-primary/10"
      />
      <MetadataItem
        icon={<Clock className="h-4 w-4 text-orange-500" />}
        label="Time"
        value={event.time}
        iconBgColor="bg-orange-100 dark:bg-orange-900/20"
      />
      <MetadataItem
        icon={<MapPin className="h-4 w-4 text-red-500" />}
        label="Location"
        value={event.location}
        iconBgColor="bg-red-100 dark:bg-red-900/20"
      />
      <MetadataItem
        icon={<User className="h-4 w-4 text-purple-500" />}
        label="Attendees"
        value={event.attendees.toString()}
        iconBgColor="bg-purple-100 dark:bg-purple-900/20"
      />
    </div>
  );
};
