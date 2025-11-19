# Cryptometer - GitHub Copilot Instructions

## Project Overview

Cryptometer is a cryptocurrency tracking dashboard that displays real-time data for cryptocurrencies listed on Binance. The application uses React, TypeScript, and TailwindCSS to provide a responsive interface for monitoring cryptocurrency prices and market data.

## Technology Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Create React App (react-scripts)
- **Styling**: TailwindCSS 3.4.9 with PostCSS and Autoprefixer
- **State Management**: React hooks and prop drilling (can be enhanced with Context API or Zustand)
- **Data Fetching**: 
  - Axios for REST API calls
  - react-use-websocket for WebSocket connections
- **Table Library**: @tanstack/react-table 8.20.1
- **Testing**: Jest and React Testing Library

## API Integration

- **Binance 24hr Data API**: Fetches daily cryptocurrency statistics
- **Binance WebSocket API**: Provides real-time price updates for cryptocurrencies
- **Rate Limiting**: Updates are throttled to once per second to properly display visual indicators

## Folder Structure

```
src/
├── components/     # All application components
│   ├── crypto-table/  # Main table component and related subcomponents
│   └── ads/          # Advertisement components
├── hooks/          # Custom React hooks
├── interfaces/     # TypeScript type definitions
└── utils/          # Text formatting and utility functions
```

## Code Style and Patterns

### TypeScript
- Use strict TypeScript settings (`strict: true` in tsconfig.json)
- Define interfaces in the `interfaces/` directory
- Use explicit type annotations for props and function parameters
- Avoid `any` types; use proper interfaces instead

### React Components
- Use functional components with hooks
- Prefer TypeScript interfaces for component props
- Use destructuring for props: `const Component: React.FC<Props> = ({ prop1, prop2 }) => {...}`
- Keep components focused and single-purpose

### State Management
- Currently uses prop drilling for data flow
- Consider Context API or Zustand for larger state management needs
- Use appropriate hooks (useState, useEffect, useRef, etc.)

### Styling
- Use TailwindCSS utility classes for styling
- Implement responsive design using Tailwind's responsive modifiers
- Follow mobile-first approach
- Maintain consistency with existing component styles

### WebSocket Usage
- Binance WebSocket API is used for real-time price updates
- Connection status is displayed to users
- Handle connection errors gracefully
- Show last update timestamp

## Testing

- Use Jest and React Testing Library
- Write tests alongside components in `.test.tsx` files
- Test user interactions and component behavior
- Run tests with: `npm test`

## Build and Deployment

### Scripts
- `npm start`: Run development server
- `npm run build`: Create production build
- `npm test`: Run tests

### Build Output
- Production builds are created in the `build/` folder
- Builds are minified and include hashed filenames
- Automatic deployment via Vercel on push to remote

## Dependencies Management

### Core Dependencies
- React and React DOM for UI
- TypeScript for type safety
- TailwindCSS for styling
- Axios for HTTP requests
- react-use-websocket for WebSocket connections
- @tanstack/react-table for table functionality

### Development Workflow
- Install dependencies: `npm install`
- Ensure all type definitions are properly installed
- Check for deprecated packages periodically

## Common Patterns

### API Calls
- Use Axios for REST API requests
- Handle loading states and errors appropriately
- Display error messages to users when API calls fail

### Real-time Updates
- Use WebSocket for live price updates
- Display visual indicators (colors) for price changes
- Green for stable/rising, red for falling prices

### Data Display
- Use React Table for structured data display
- Implement both desktop and mobile views
- Show connection status and last update time

## Areas for Improvement

The following improvements are documented for future consideration:

1. **State Management**: Extract prop drilling to Context API or Zustand
2. **Dynamic Currency Management**: Add input fields and remove buttons for user-controlled currency lists
3. **WebSocket Strategy**: Currently using WebSocket API; consider WebSocket Stream for better rate limit management
4. **Update Rate**: Currently set to 1 second for visual requirements; can be adjusted based on needs

## Best Practices

- Keep changes minimal and focused
- Test changes in both desktop and mobile viewports
- Ensure WebSocket connections are properly managed
- Handle edge cases (connection failures, API errors, etc.)
- Follow existing code patterns and conventions
- Maintain responsive design principles
- Document complex logic with comments when necessary
