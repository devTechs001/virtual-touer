# Virtual Tourist - Components Library (2026)

Complete reference for all React components in the application.

---

## 📊 Component Summary

| Category | Count | Location |
|----------|-------|----------|
| **Dashboard** | 4 | `components/common/`, `components/notification/` |
| **Maps & Navigation** | 3 | `components/maps/` |
| **Destination Tools** | 5 | `components/destination/` |
| **Media & Social** | 3 | `components/common/`, `components/social/`, `components/vr/` |
| **Booking** | 3 | `components/booking/` |
| **Tours** | Multiple | `components/tours/` |
| **Layout** | Multiple | `components/layout/` |
| **Auth** | Multiple | `components/auth/` |

---

## 🆕 New Components (v2.0)

### Dashboard Components

#### 1. NotificationCenter
**Path**: `components/notification/NotificationCenter.jsx`

**Features**:
- 7 notification types
- Real-time updates
- Mark as read/unread
- Delete notifications
- Filter by type
- Search functionality
- Priority badges
- Action buttons

**Props**:
```typescript
interface NotificationCenterProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}
```

**Usage**:
```jsx
import { NotificationCenter } from './components/notification';

<NotificationCenter 
  onNotificationClick={(n) => console.log(n)}
  compact={false}
/>
```

---

#### 2. QuickActions
**Path**: `components/common/QuickActions.jsx`

**Features**:
- 10 quick actions
- Keyboard shortcuts (⌘+N, ⌘+B, etc.)
- Recently used tracking
- Search functionality
- Direct navigation

**Props**:
```typescript
interface QuickActionsProps {
  onActionClick?: (action: Action) => void;
  showShortcuts?: boolean;
}
```

**Actions**:
| Action | Shortcut | Description |
|--------|----------|-------------|
| Create Tour | ⌘+N | Add new tour |
| Add Destination | ⌘+D | Create destination |
| View Bookings | ⌘+B | Manage bookings |
| Manage Users | ⌘+U | Edit users |
| Analytics | ⌘+A | View statistics |
| Revenue | ⌘+R | Financial overview |
| Reviews | ⌘+E | Moderate reviews |
| Messages | ⌘+M | Support tickets |
| Notifications | ⌘+L | Alert center |
| Settings | ⌘+, | Configuration |

---

#### 3. ActivityFeed
**Path**: `components/common/ActivityFeed.jsx`

**Features**:
- Real-time activity stream
- 7 activity types
- Filter by type
- Time range filter
- Statistics summary
- Export to JSON

**Props**:
```typescript
interface ActivityFeedProps {
  activities?: Activity[];
  limit?: number;
  showFilter?: boolean;
  compact?: boolean;
  onActivityClick?: (activity: Activity) => void;
}
```

---

#### 4. EnhancedDashboardStats
**Path**: `components/common/EnhancedDashboardStats.jsx`

**Features**:
- 4 summary stat cards
- Performance metrics
- Multiple chart types (Line, Area, Bar)
- Time range selection
- Top destinations table
- Category breakdown

**Props**:
```typescript
interface EnhancedDashboardStatsProps {
  stats?: DashboardStats;
  timeRange?: '24h' | '7d' | '30d' | '90d';
  showCharts?: boolean;
}
```

---

### User Dashboard Components

#### 5. TripPlanner
**Path**: `components/booking/TripPlanner.jsx`

**Features**:
- Multiple trip management
- 5 trip statuses
- Budget tracking
- Destination checklist
- Trip sharing
- Export details

**Props**:
```typescript
interface TripPlannerProps {
  trips?: Trip[];
  onTripUpdate?: (trip: Trip) => void;
}
```

---

### Maps & Navigation Components

#### 6. Compass
**Path**: `components/maps/Compass.jsx`

**Features**:
- Device orientation API
- Auto North fallback (OFFLINE)
- Cardinal directions
- Degree display
- Mode indicator
- Debug info

**Props**:
```typescript
interface CompassProps {
  onHeadingChange?: (heading: number) => void;
  showDebugInfo?: boolean;
}
```

**Offline Behavior**:
- Automatically falls back to North mode when:
  - Device is offline
  - Orientation API unavailable
  - Permission denied

---

#### 7. WorldAtlas
**Path**: `components/maps/WorldAtlas.jsx`

**Features**:
- 12 countries with details
- Search functionality
- Region filtering
- Country details modal
- Favorites system

**Props**:
```typescript
interface WorldAtlasProps {
  onCountrySelect?: (country: Country) => void;
}
```

**Countries Included**:
France, Japan, USA, Italy, Australia, Egypt, Brazil, India, UK, Thailand, Greece, UAE

---

### Destination Tools

#### 8. WeatherWidget
**Path**: `components/destination/WeatherWidget.jsx`

**Features**:
- Current weather display
- 7-day forecast
- Humidity & wind speed
- Auto-refresh
- Offline cache (1 hour)

**Props**:
```typescript
interface WeatherWidgetProps {
  location?: string;
  coordinates?: [number, number];
  compact?: boolean;
  showForecast?: boolean;
  autoUpdate?: boolean;
}
```

---

#### 9. TravelGuide
**Path**: `components/destination/TravelGuide.jsx`

**Features**:
- Pre-trip checklist
- Packing lists (interactive)
- Safety guidelines
- Cultural etiquette
- Budget tips
- Regional-specific advice

**Props**:
```typescript
interface TravelGuideProps {
  destination?: Destination;
  selectedCategory?: string;
}
```

**Categories**:
- Before You Go
- Packing Essentials
- Money & Budget
- Safety First
- Local Culture

---

#### 10. CurrencyConverter
**Path**: `components/destination/CurrencyConverter.jsx`

**Features**:
- 35+ currencies
- Real-time rates
- Offline cache (24 hours)
- 30-day trend chart
- Popular pairs

**Props**:
```typescript
interface CurrencyConverterProps {
  fromCurrency?: string;
  toCurrency?: string;
  amount?: number;
  showHistory?: boolean;
  compact?: boolean;
}
```

---

#### 11. NearbyPlaces
**Path**: `components/destination/NearbyPlaces.jsx`

**Features**:
- 6 categories
- Distance calculations
- Ratings & reviews
- Sort options
- Place details modal

**Props**:
```typescript
interface NearbyPlacesProps {
  location?: string;
  radius?: number;
  showAll?: boolean;
  maxResults?: number;
}
```

**Categories**:
- 🍴 Restaurants
- 🏨 Hotels
- ☕ Cafes
- 🛍️ Shopping
- ⛽ Gas Stations
- 🏥 Medical

---

#### 12. TimelineView
**Path**: `components/destination/TimelineView.jsx`

**Features**:
- Day-by-day planning
- 5 activity types
- Progress tracking
- Completion checkboxes
- Auto-save (localStorage)

**Props**:
```typescript
interface TimelineViewProps {
  destination?: Destination;
  duration?: number;
  itinerary?: Itinerary;
  onSave?: (itinerary: Itinerary) => void;
}
```

---

### Media & Social Components

#### 13. PhotoGallery
**Path**: `components/common/PhotoGallery.jsx`

**Features**:
- Responsive grid
- Fullscreen lightbox
- Image navigation
- Favorites system
- Download capability
- Share functionality

**Props**:
```typescript
interface PhotoGalleryProps {
  images?: Image[];
  title?: string;
  allowDownload?: boolean;
  allowShare?: boolean;
  columns?: number;
}
```

---

#### 14. SocialSharing
**Path**: `components/social/SocialSharing.jsx`

**Features**:
- 5 social platforms
- Copy link
- Native share API
- Custom share text

**Props**:
```typescript
interface SocialSharingProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  compact?: boolean;
}
```

**Platforms**:
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Email

---

#### 15. ARView
**Path**: `components/vr/ARView.jsx`

**Features**:
- Camera access
- AR overlays
- Compass display
- Landmark markers
- Fullscreen mode

**Props**:
```typescript
interface ARViewProps {
  destination?: Destination;
  landmarks?: Landmark[];
  onClose?: () => void;
  showInfo?: boolean;
}
```

---

## 📋 Existing Components

### Tour Components (`components/tours/`)
- TourCard
- TourList
- TourFilters
- TourSearch
- TourBooking

### Layout Components (`components/layout/`)
- MainLayout
- Header
- Footer
- Sidebar
- UserSidebar

### Auth Components (`components/auth/`)
- LoginForm
- RegisterForm
- ProtectedRoute
- AuthProvider

### VR Components (`components/vr/`)
- VRViewer
- ThreeScene
- Viewer360

### Common Components (`components/common/`)
- Button
- Input
- Card
- Modal
- Spinner
- Badge
- LoadingScreen

---

## 🎨 Component Styling

All components use:
- **Tailwind CSS** for styling
- **Dark theme** (`dark-*` classes)
- **Framer Motion** for animations
- **Lucide React** for icons

### Color Scheme
```javascript
{
  primary: '#3b82f6',    // Blue
  secondary: '#8b5cf6',  // Purple
  success: '#22c55e',    // Green
  warning: '#f59e0b',    // Orange
  danger: '#ef4444',     // Red
  dark: '#1f2937'        // Dark gray
}
```

---

## 🔌 Component Integration

### Import Pattern

```javascript
// Named exports from index files
import { 
  NotificationCenter,
  QuickActions,
  ActivityFeed
} from './components';

// Or direct imports
import NotificationCenter from './components/notification/NotificationCenter';
```

### Index Files

```javascript
// components/common/index.js
export { default as QuickActions } from './QuickActions';
export { default as ActivityFeed } from './ActivityFeed';
export { default as EnhancedDashboardStats } from './EnhancedDashboardStats';
export { default as PhotoGallery } from './PhotoGallery';

// components/notification/index.js
export { default as NotificationCenter } from './NotificationCenter';

// components/destination/index.js
export { default as WeatherWidget } from './WeatherWidget';
export { default as TravelGuide } from './TravelGuide';
export { default as CurrencyConverter } from './CurrencyConverter';
export { default as NearbyPlaces } from './NearbyPlaces';
export { default as TimelineView } from './TimelineView';

// components/booking/index.js
export { default as TripPlanner } from './TripPlanner';

// components/maps/index.js
export { default as Compass } from './Compass';
export { default as WorldAtlas } from './WorldAtlas';

// components/social/index.js
export { default as SocialSharing } from './SocialSharing';

// components/vr/index.js
export { default as ARView } from './ARView';
```

---

## 📊 Component Status

| Component | Offline | Tests | Docs |
|-----------|---------|-------|------|
| NotificationCenter | ⚠️ Partial | ✅ | ✅ |
| QuickActions | ✅ Full | ✅ | ✅ |
| ActivityFeed | ✅ Full | ✅ | ✅ |
| EnhancedDashboardStats | ✅ Full | ✅ | ✅ |
| TripPlanner | ✅ Full | ✅ | ✅ |
| Compass | ✅ Full | ✅ | ✅ |
| WorldAtlas | ✅ Full | ✅ | ✅ |
| WeatherWidget | ⚠️ Cached | ✅ | ✅ |
| TravelGuide | ✅ Full | ✅ | ✅ |
| CurrencyConverter | ⚠️ Cached | ✅ | ✅ |
| NearbyPlaces | ✅ Full | ✅ | ✅ |
| TimelineView | ✅ Full | ✅ | ✅ |
| PhotoGallery | ✅ Full | ✅ | ✅ |
| SocialSharing | ❌ Online | ✅ | ✅ |
| ARView | ✅ Full | ✅ | ✅ |

---

**Last Updated**: March 2026  
**Version**: 2.0.0
