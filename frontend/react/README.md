# ADS4GPTs Ad React Component

Open source React Component, handling the in-app display of ads retrieved using Ads4GPTs. Customizable. Responsive. Easy to integrate - Simply copy and paste the component source code in your app.

## Installation

### 1. Install Tailwind CSS

The AdCard component is styled using Tailwind CSS. If you haven't set up Tailwind CSS in your project yet, follow the [Tailwind CSS installation instructions](https://tailwindcss.com/docs/installation) to get started.

### 2. Install Dependencies

Add the following dependencies to your project:

```bash
npm install clsx tailwind-merge
```

### 3. Add the cn Helper Function

Create a utility function cn to merge class names. This function combines clsx and tailwind-merge for optimal class name handling. Copy the cn code from the components/utils file and paste it into your project.

## Usage

Copy the AdCard component code from the components/AdCard file and paste it into your project. Initialize it with values retrieved from Ads4GPTs tool calls, along with optional style-overriding props.

## Examples

### Use with default values/styling

```tsx
<AdCard
    ad_creative="https://example.com/ad-image.png"
    ad_title="Default AdCard"
    ad_body="This is the default styling of the AdCard component."
    ad_link="https://www.example.com"
    ad_link_cta="Learn More"
/>
```

### Use with custom styling

Override the default styles using the styles prop:

```tsx
<AdCard
    ad_creative="https://example.com/ad-image.png"
    ad_title="Custom Styled AdCard"
    ad_body="This AdCard has custom styles applied."
    ad_link="https://www.example.com"
    ad_link_cta="Get Started"
    styles={{
        container: 'bg-blue-100 rounded-xl p-4',
        title: 'text-blue-800 text-lg font-bold',
        adBadge: 'bg-blue-500 text-white px-2 rounded-full',
        body: 'text-blue-700 text-base',
        link: 'text-blue-600 underline',
    }}
/>
```

### Use with custom render functions

Provide custom render functions for the title and body:

```tsx
<AdCard
    ad_creative="https://example.com/ad-image.png"
    ad_title="Custom Render AdCard"
    ad_body="This AdCard uses custom render functions for the title and body."
    ad_link="https://www.example.com"
    ad_link_cta="Sign Up"
    renderAdTitle={(title) => (
        <h2 className="text-purple-600 text-2xl font-extrabold">{title}</h2>
    )}
    renderAdBody={(body) => (
        <div>
            <p className="text-purple-500">{body}</p>
            <p className="text-gray-500 text-xs">
                *Terms and conditions apply.
            </p>
        </div>
    )}
/>
```

### Use with custom styling and custom render functions

Combine custom styles and render functions for full customization:

```tsx
<AdCard
    ad_creative="https://example.com/ad-image.png"
    ad_title="Fully Customized AdCard"
    ad_body="This AdCard combines custom styles and render functions."
    ad_link="https://www.example.com"
    ad_link_cta="Discover More"
    styles={{
        container: 'bg-green-100 rounded-lg p-6 shadow-lg',
        link: 'text-green-700 font-semibold',
    }}
    renderAdTitle={(title) => (
        <h1 className="text-green-800 text-3xl font-bold">{title}</h1>
    )}
    renderAdBody={(body) => <p className="text-green-600 text-lg">{body}</p>}
/>
```

## Running the Playground App

The repository includes a playground app in the playground folder, allowing you to test and experiment with the AdCard component.

### Installation

1. Clone the Repository and navigate to the playground app's folder

```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
cd ads4gpts/frontend/react/playground
```

2. Install Dependencies

```bash
npm install
```

3. Start the server

```bash
npm run dev
```

4. Start experimenting by navigating to [http://localhost:3000](http://localhost:3000) with your browser.

### Playground App Overview

The playground app showcases the functionality of the AdCard component with real-time style editing. It includes:

-   AdCard Display: Displays a sample ad using default or customized styles.
-   Style Editor: Allows dynamic modification of the Tailwind CSS classes applied to the component's elements.

### Playground App Usage

The style editor initializes its fields with the default Tailwind CSS classes for the AdCard component. Styles can be customized using the provided text areas, and the app instantly previews the changes in the AdCard display.
