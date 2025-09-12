# Metadata Components

## Overview

This project includes reusable metadata components that can be used to display key-value information with consistent styling across the application.

## Components

### 1. MetadataItem (Generic Component)

A flexible, reusable component for displaying metadata with an icon, label, and value.

#### Props

| Prop Name    | Type      | Required | Description                           |
|--------------|-----------|----------|---------------------------------------|
| icon         | ReactNode | Yes      | Icon to display                       |
| label        | string    | Yes      | Label text                            |
| value        | string or ReactNode | Yes      | Value to display (string or custom component) |
| iconBgColor  | string    | No       | Background color for the icon container (default: "bg-primary/10") |

#### Usage Example

```tsx
import { MetadataItem } from "@/components/metadata-item";
import { User, Calendar } from "lucide-react";

// Simple usage with string value
<MetadataItem
  icon={<User className="h-4 w-4 text-primary" />}
  label="Name"
  value="John Doe"
/>

// Custom value with styling
<MetadataItem
  icon={<Calendar className="h-4 w-4 text-primary" />}
  label="Date"
  value={<span className="text-sm font-semibold">January 1, 2023</span>}
  iconBgColor="bg-blue-100 dark:bg-blue-900/20"
/>
```

### 2. NoteMetadataCard (Specific Implementation)

A specialized component for displaying note metadata (created date, updated date, category) using the generic MetadataItem component.

#### Props

| Prop Name | Type   | Required | Description      |
|-----------|--------|----------|------------------|
| createdAt | Date   | Yes      | Creation date    |
| updatedAt | Date   | Yes      | Last updated date|
| category  | string or null | Yes      | Note category    |

#### Usage Example

```tsx
import { NoteMetadataCard } from "@/components/note-metadata-card";

<NoteMetadataCard
  createdAt={note.createdAt}
  updatedAt={note.updatedAt}
  category={note.category}
/>
```

## Creating Custom Metadata Components

You can create your own specialized metadata components by combining multiple MetadataItem components:

```tsx
import { MetadataItem } from "@/components/metadata-item";
import { User, Mail, Phone } from "lucide-react";

export const UserProfileMetadata = ({ user }: { user: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetadataItem
        icon={<User className="h-4 w-4 text-primary" />}
        label="Name"
        value={user.name}
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
```

## Styling

The MetadataItem component uses the following styling classes:
- Container: `flex items-center space-x-3 p-3 rounded-lg bg-muted/50 border`
- Icon container: `p-2 rounded-full` (with customizable background color)
- Label: `text-xs font-medium text-muted-foreground uppercase tracking-wide`
- Value: Uses Badge component for string values, or custom styling for ReactNode values

You can customize the appearance by passing different `iconBgColor` values or by modifying the component directly.