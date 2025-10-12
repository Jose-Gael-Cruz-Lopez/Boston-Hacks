# PixelPal - 8-bit Arcade AI Media Remixer

A responsive, multi-page React/Next.js application with an authentic 8-bit arcade aesthetic inspired by Pac-Man and retro gaming.

## 🎮 Features

### Page 1: Upload & Prompt
- **FileUpload Component**: Drag & drop or click to upload images/videos
- **Live Preview**: Instant preview of uploaded media
- **Prompt Input**: Styled textarea with "Describe the vibe..." placeholder
- **Generate Button**: Pixel-font "Generate Changes" button with validation

### Page 2: Loading
- **Pixel Spinner**: Animated loading spinner in arcade yellow
- **Dynamic Text**: "> LOADING..." with animated dots
- **API Integration**: Calls `/api/generateChanges` with file + prompt
- **Auto Navigation**: Redirects to Workflow page after completion

### Page 3: Workflow
- **Change Cards**: Vertical list of editable change cards
- **Inline Editing**: Click titles to edit them directly
- **Filter Dropdowns**: Populated with AI-generated filter options
- **Intensity Sliders**: Range sliders (0-100) for each change
- **Live Previews**: Thumbnail previews for each change
- **History Sidebar**: Right-aligned history with numbered entries
- **Responsive Design**: Stacks sidebar below main panel on mobile

## 🎨 8-bit Arcade Aesthetic

### Color Palette
- **Primary**: Bright pixel yellow (#FFE400)
- **Accents**: Neon cyan (#00FFFF) and hot pink (#FF69B4)
- **Background**: Solid black with pixel star pattern overlay
- **Text**: Light gray (#CCCCCC) for body text

### Typography
- **Headings/Buttons**: "Press Start 2P" pixel font
- **Body Text**: Courier New monospace terminal font
- **Effects**: Pixel glow, chromatic aberration, scanlines

### Visual Effects
- **Floating Particles**: Circular orbital motion creating sphere-like effect
- **Pixel Borders**: 4px solid borders with drop shadows
- **Neon Glows**: Text shadows and box shadows for retro feel
- **Animations**: Framer Motion for smooth card transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd nextjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Upload & Prompt page
│   │   ├── loading/
│   │   │   └── page.tsx            # Loading page
│   │   ├── workflow/
│   │   │   └── page.tsx            # Workflow page
│   │   ├── api/
│   │   │   └── generateChanges/
│   │   │       └── route.ts         # API endpoint
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   └── components/
│       ├── FileUpload.tsx           # File upload component
│       ├── WorkflowCard.tsx         # Change card component
│       └── HistorySidebar.tsx       # History sidebar component
├── tailwind.config.js               # Tailwind configuration
└── package.json                     # Dependencies
```

## 🔧 API Integration

### `/api/generateChanges` Endpoint

**Method**: POST  
**Content-Type**: multipart/form-data

**Request Body**:
- `file`: Image or video file
- `prompt`: Text description of desired changes

**Response**:
```json
{
  "success": true,
  "changes": [
    {
      "title": "Add Retro Lighting",
      "filterOptions": ["Vintage", "Neon", "Cyberpunk", "Synthwave"],
      "intensity": 75,
      "previewUrl": "/api/placeholder/200/200"
    }
  ]
}
```

## 🎯 Usage Flow

1. **Upload Media**: Drag & drop or click to upload image/video
2. **Describe Vibe**: Enter prompt describing desired changes
3. **Generate**: Click "Generate Changes" button
4. **Loading**: Watch pixel spinner while AI processes
5. **Workflow**: Edit change titles, adjust filters and intensity
6. **History**: View and restore previous versions
7. **Responsive**: Works on desktop and mobile devices

## 🎨 Customization

### Colors
Update `tailwind.config.js` to modify the arcade color palette:
```javascript
colors: {
  'arcade-yellow': '#FFE400',
  'arcade-cyan': '#00FFFF',
  'arcade-pink': '#FF69B4',
  // ... add more colors
}
```

### Fonts
The pixel font "Press Start 2P" is loaded from Google Fonts. To use custom fonts:
1. Add font files to `public/fonts/`
2. Update `globals.css` with `@font-face` declarations
3. Modify `tailwind.config.js` font families

### Animations
Framer Motion animations can be customized in each component:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

## 🔍 Technical Details

### State Management
- **File State**: Managed in Upload page, passed via sessionStorage
- **Changes State**: Managed in Workflow page, updated on user interactions
- **History State**: Persisted in localStorage, survives page reloads

### Responsive Design
- **Desktop**: Side-by-side layout with main panel and history sidebar
- **Mobile**: Stacked layout with sidebar below main panel
- **Breakpoint**: 768px (lg in Tailwind)

### Performance
- **Particles**: Pure CSS animations, no JavaScript overhead
- **Images**: Optimized previews with proper aspect ratios
- **State**: Efficient updates with React hooks

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**: Run `npm install` to ensure all dependencies are installed

2. **Styling not applied**: Check that Tailwind CSS is properly configured in `globals.css`

3. **File upload not working**: Ensure the FileUpload component has proper event handlers

4. **API errors**: Check browser console for detailed error messages

### Development Tips

- Use browser dev tools to inspect pixel-perfect styling
- Test responsive design by resizing browser window
- Check localStorage for history persistence
- Monitor network tab for API calls

## 📝 License

This project is created for educational purposes. Feel free to modify and extend for your own use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Ready to remix your media in retro style!** 🎮✨
