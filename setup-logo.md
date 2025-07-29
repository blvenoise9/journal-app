# Dream Machine Journal App - Logo Setup Guide

## Step 1: Prepare Your Logo Image

1. Save the Dream Machine clock logo as `dream-machine-logo.png` on your Desktop
2. Make sure it's a square image (1024x1024 recommended) with transparent background if possible

## Step 2: Generate Required Icon Sizes

For iOS apps, you need multiple icon sizes. You can use online tools or do this manually:

### Required Sizes:
- **1024x1024** - App Store icon
- **180x180** - iPhone 6 Plus/6s Plus/7 Plus (@3x)
- **120x120** - iPhone 6/6s/7 (@2x)
- **87x87** - Settings icon (@3x)
- **58x58** - Settings icon (@2x)
- **80x80** - Spotlight icon (@3x)
- **60x60** - Spotlight icon (@2x)
- **40x40** - Spotlight icon (@1x)

### Online Icon Generator Options:
1. **AppIcon.co** - https://appicon.co
2. **MakeAppIcon** - https://makeappicon.com
3. **IconKitchen** - https://icon.kitchen

## Step 3: Manual Setup (Alternative)

If you want to set up manually:

1. Open your logo in an image editor (Preview, Photoshop, etc.)
2. Resize to each required size
3. Save each as PNG with naming convention:
   - `AppIcon-40.png` (40x40)
   - `AppIcon-58.png` (58x58)
   - `AppIcon-60.png` (60x60)
   - `AppIcon-80.png` (80x80)
   - `AppIcon-87.png` (87x87)
   - `AppIcon-120.png` (120x120)
   - `AppIcon-180.png` (180x180)
   - `AppIcon-1024.png` (1024x1024)

## Step 4: Add to iOS Project

1. Copy all icon files to: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Update the `Contents.json` file with proper configuration
3. Open Xcode project and verify icons are properly set

## Step 5: Update App Name

The app is currently named "Journal App" - you might want to change it to "Dream Machine" or similar.

## Next Steps

After setting up the logo:
1. Test the app in iOS Simulator
2. Build for your device
3. Install on your iPhone for personal use 