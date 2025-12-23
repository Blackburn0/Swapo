# UI Components Guide

This document explains how to use the reusable UI components and utilities in the project. It covers buttons, inputs, toast notifications, and import path setup.

---

## 1. Button Component

**File:** `src/components/ui/Button.tsx`

### Usage

```tsx
import Button from '@/components/ui/Button';

<Button>Click Me</Button>;
```

**Props**

| Prop         | Type         | Description                         |
| ------------ | ------------ | ----------------------------------- |
| `children`   | `ReactNode`  | Button text or elements             |
| `onClick?`   | `() => void` | Optional click handler              |
| `className?` | `string`     | Extend or override Tailwind classes |

**Default Style:**
Orange background, full width, `rounded-xl`, `py-2`, `text-white`.

---

## 2. Input Component

**File:** `src/components/ui/Input.tsx`

### Usage

```tsx
import Input from '@/components/ui/Input';

<Input type="text" name="email" />;
```

**Props**

| Prop         | Type          | Description                                   |
| ------------ | ------------- | --------------------------------------------- |
| `type`       | `string`      | Input type (e.g. `text`, `email`, `password`) |
| `name`       | `string`      | Input name                                    |
| `value?`     | `string`      | Controlled input value                        |
| `onChange?`  | `(e) => void` | Change handler                                |
| `className?` | `string`      | Extend or override Tailwind classes           |

**Default Style:**
Gray border, slightly rounded corners, smooth focus ring.

---

## 3. Toast Notifications

**Files:**

- `src/context/ToastContext.tsx`
- `src/hooks/useToast.ts`
- `src/components/ui/Toaster.tsx`

### Setup

Wrap your app with the toast provider:

```tsx
// main.tsx or App.tsx
import { ToastProvider } from '@/context/ToastContext';

<ToastProvider>
  <App />
</ToastProvider>;
```

### Usage

```tsx
import { useToast } from '@/hooks/useToast';

const Example = () => {
  const { showToast } = useToast();

  return (
    <Button onClick={() => showToast('Profile updated!', 'success')}>
      Show Toast
    </Button>
  );
};
```

**Toast types:**
`"success"` | `"error"` | `"info"`

---

## 4. Importing with `@/`

To simplify imports and avoid long relative paths:

1. Open `tsconfig.json`.
2. Add or update the following configuration:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

3. Restart your development server for the change to take effect.

Now you can import files like this:

```tsx
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
```

---

## 5. Folder Structure

Organize UI components consistently for clarity:

```
src/
 ├─ components/
 │   └─ ui/
 │       ├─ Button.tsx
 │       ├─ Input.tsx
 │       └─ Toaster.tsx
 ├─ context/
 │   └─ ToastContext.tsx
 └─ hooks/
     └─ useToast.ts
```

## Icons

Use lucide-react for icons

## Routing

The AppRoutes is in the components/routing/ folder

## Button, Input & Toast in action

Check home page '/' to see them in action

<!-- TODO: -->

- use the authcontext to track authentication:
  - signup
  - login
  - logout
  - protected routes
