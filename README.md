# KoinX – Tax Loss Harvesting Tool

A responsive React + TypeScript application that replicates the Tax Loss Harvesting interface from the KoinX frontend assignment and implements real-time harvesting logic using mocked API responses.

## Live Links

- **Deployed App:** https://koinx-smoky.vercel.app/
- **GitHub Repository:** https://github.com/yash0260/Koinx

## Features

- Pre-Harvesting and After-Harvesting capital gains cards.
- Real-time recalculation of capital gains when holdings are selected or deselected.
- Holdings table with checkbox selection and select-all behavior.
- Amount to Sell column populated from selected holdings.
- View All / Show Less functionality in the holdings table.
- Loader state and error handling for mocked API calls.
- Responsive layout for desktop and mobile screens.
- Light and dark mode toggle.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Context API + useReducer

## Folder Structure

```bash
src/
├── components/
│   ├── CapitalGainsCard.tsx
│   ├── HoldingsTable.tsx
│   ├── HowItWorks.tsx
│   ├── InfoTooltip.tsx
│   ├── Navbar.tsx
│   └── SkeletonLoader.tsx
├── context/
│   └── HarvestingContext.tsx
├── hooks/
│   └── useHarvestedGains.ts
├── services/
│   └── mockApi.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <https://github.com/yash0260/Koinx>
cd koinx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

### 4. Build for production

```bash
npm run build
```

## Business Logic

The app uses two mocked APIs as required by the assignment:

1. **Holdings API** – returns the user holdings list.
2. **Capital Gains API** – returns the pre-harvesting short-term and long-term profits/losses.

When a holding is selected:

- Positive short-term gain is added to short-term profits.
- Negative short-term gain is added to short-term losses.
- Positive long-term gain is added to long-term profits.
- Negative long-term gain is added to long-term losses.
- The After Harvesting card updates in real time.

## Assumptions

- Mock APIs are implemented using promises inside the React app, which is allowed in the assignment.
- Currency values are displayed in INR format.
- The UI follows the provided Figma and assignment demo as closely as possible.
- A dark mode toggle was added as an extra UX enhancement.


## Notes

This project was built as part of the KoinX Frontend Intern assignment, which required a responsive React application, mocked APIs, real-time business logic updates, and deployment within the submission window.
