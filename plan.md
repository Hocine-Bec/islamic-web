Quick fix — just increase the text sizes slightly across the dashboard. Update these specific classes in `app/(admin-group)/admin/dashboard/page.tsx`:

**Greeting:**
```tsx
<h1 className="text-xl font-semibold text-gray-800">
  مرحباً بك يا شيخ 👋
</h1>
<p className="text-sm text-gray-400 mt-1">
  إليك ملخص آخر التحديثات على الموقع
</p>
```

**Date badge:**
```tsx
<div className="text-sm text-gray-500 bg-white border border-gray-100 px-3 py-2 rounded-lg">
```

**Stat cards — label and sub:**
```tsx
<span className="text-sm text-gray-400">{stat.label}</span>
```
```tsx
<div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
```

**Stat number:**
```tsx
<div className="text-3xl font-semibold text-gray-800">
```

**Section headers:**
```tsx
<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
```

**Activity items — title:**
```tsx
<p className="text-sm text-gray-700 line-clamp-1 leading-relaxed">
```

**Activity items — meta:**
```tsx
<p className="text-xs text-gray-400 mt-0.5">
```

**Action links:**
```tsx
<span className="text-xs text-green-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
```

**Sidebar nav links** in `AdminSidebar.tsx`:
```tsx
className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
```

Change the icon sizes in sidebar from `size={15}` to `size={16}` throughout.

That should make everything comfortably readable without changing the layout. Let me know how it looks!