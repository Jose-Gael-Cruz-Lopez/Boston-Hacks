# PixelPal - 8-bit Arcade AI Media Remixer

Legacy photo editing tools like Adobe Photoshop, GIMP, and Adobe Lightroom have become industry standards—but they're also cluttered, technical, and highly unintuitive for everyday users. PixelPal reimagines photo editing by combining the power of AI with a fun, accessible arcade interface that anyone can use.

We asked: What if photo editing felt like playing a retro game instead of navigating complex menus?

PixelPal is a Next.js web application that uses Google Gemini AI to transform your photos through natural language. Instead of adjusting sliders and filters manually, you simply describe what you want—like "give the picture a 90s film retro vibe"—and PixelPal generates a step-by-step visual workflow to bring your vision to life.

https://github.com/user-attachments/assets/7e54d506-4134-4a00-ae61-0941344bbcb5


## How to Use PixelPal

### Step 1: Upload Your Photo
- Drag and drop an image or video into the upload zone
- Or click to browse your files
- Instant preview of your media

### Step 2: Describe Your Vision
- Type a natural language prompt in the retro-styled text area
- Examples:
  - "Make it look like an old polaroid photo"
  - "Add cyberpunk neon lighting"
  - "Give it a dreamy, ethereal vibe"

### Step 3: Generate Workflow
- Click the **"Generate Changes"** button
- Watch the arcade-style loading animation
- AI processes your request in seconds

### Step 4: Refine Your Edit
- Review the step-by-step workflow cards
- Click any card title to edit the instruction
- Adjust filter dropdowns and intensity sliders
- See live previews of each change

### Step 5: Explore History
- Browse all previous versions in the history sidebar
- Click any thumbnail to restore that version
- History persists even after closing the browser

### Step 6: Download & Share
- Export your final edited image
- Share your creation on social media


### Typography
- **Headings/Buttons**: "Press Start 2P" pixel font
- **Body Text**: Courier New monospace terminal font
- **Effects**: Pixel glow, chromatic aberration, scanlines

### Visual Effects
- **Floating Particles**: Circular orbital motion creating sphere-like effect
- **Pixel Borders**: 4px solid borders with drop shadows
- **Neon Glows**: Text shadows and box shadows for retro feel
- **Animations**: Framer Motion for smooth card transitions

## Getting Started

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

## API Integration

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

## Usage Flow

1. **Upload Media**: Drag & drop or click to upload image/video
2. **Describe Vibe**: Enter prompt describing desired changes
3. **Generate**: Click "Generate Changes" button
4. **Loading**: Watch pixel spinner while AI processes
5. **Workflow**: Edit change titles, adjust filters and intensity
6. **History**: View and restore previous versions
7. **Responsive**: Works on desktop and mobile devices

## Customization

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

## Technical Details

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

##  Troubleshooting

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

## License

This project is created for educational purposes. Feel free to modify and extend for your own use.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


